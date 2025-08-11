import { z, RefinementCtx } from "zod";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
import { AgencyRepository } from "../../repositories/agency/AgencyRepository.js";
import { RegistrationRequestRepository } from "../../repositories/registrationRequest/RegistrationRequest.js";
import { prisma } from "../../config/prisma.js";
// Initialize repository instances
const userRepo = new UserRepositoryPrisma(prisma);
const agencyRepo = new AgencyRepository(prisma);
const registrationRequestRepo = new RegistrationRequestRepository(prisma);

export const registrationSchema = z
  .object({
    username: z
      .string()
      .min(4, "Username must be at least 4 characters long.")
      .refine(val => !/\s/.test(val), "Username must not contain spaces."),

    email: z.email("Email is not valid."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .refine(val => !/\s/.test(val), "Password must not contain spaces."),

    repeatPassword: z.string(),

    first_name: z.string().min(1, "First name is required."),
    last_name: z.string().min(1, "Last name is required."),

    terms_accepted: z.literal(true, {
      message: "Please accept the terms and conditions.",
    }),

    role: z.enum(["user", "agency_owner", "agent"]),

    // Optional fields based on role
    agency_name: z.string().optional(),
    license_number: z.string().optional(),
    address: z.string().optional(),
    public_code: z.string().optional(),
    id_card_number: z.string().optional(),
    requested_role: z.enum(["agent", "senior_agent", "team_lead"]).optional(),
  })
  .superRefine(async (data: z.infer<typeof registrationSchema>, ctx: RefinementCtx) => {
    // Password confirmation
    if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords do not match.",
        path: ["repeatPassword"],
      });
    }

    // Role-based required fields
    if (data.role === "agency_owner") {
      if (!data.agency_name?.trim()) {
        ctx.addIssue({ code: "custom", message: "Agency name is required.", path: ["agency_name"] });
      }
      if (!data.license_number?.trim()) {
        ctx.addIssue({ code: "custom", message: "License number is required.", path: ["license_number"] });
      }
      if (!data.address?.trim()) {
        ctx.addIssue({ code: "custom", message: "Address is required.", path: ["address"] });
      }
    }

    if (data.role === "agent") {
      if (!data.public_code?.trim()) {
        ctx.addIssue({ code: "custom", message: "Public code is required.", path: ["public_code"] });
      }
      if (!data.id_card_number?.trim()) {
        ctx.addIssue({ code: "custom", message: "ID card number is required.", path: ["id_card_number"] });
      }
      if (!data.requested_role) {
        ctx.addIssue({ code: "custom", message: "Role in agency is required.", path: ["requested_role"] });
      }
    }

    // Uniqueness checks
    try {
      // Check email uniqueness
      const emailExists = await userRepo.emailExists(data.email);
      if (emailExists) {
        ctx.addIssue({ code: "custom", message: "Email already exists.", path: ["email"] });
      }

      // Check username uniqueness
      const usernameExists = await userRepo.usernameExists(data.username);
      if (usernameExists) {
        ctx.addIssue({ code: "custom", message: "Username already exists.", path: ["username"] });
      }

      // Agency owner specific validations
      if (data.role === "agency_owner") {
        if (data.agency_name && await agencyRepo.agencyNameExist(data.agency_name)) {
          ctx.addIssue({ code: "custom", message: "Agency name already exists.", path: ["agency_name"] });
        }
        if (data.license_number && await agencyRepo.licenseExists(data.license_number)) {
          ctx.addIssue({ code: "custom", message: "License number already exists.", path: ["license_number"] });
        }
      }

      // Agent specific validations
      if (data.role === "agent") {
        const agency = data.public_code ? await agencyRepo.findByPublicCode(data.public_code) : null;
        if (!agency) {
          ctx.addIssue({ code: "custom", message: "Invalid public code.", path: ["public_code"] });
        }

        if (data.id_card_number && await registrationRequestRepo.idCardExists(data.id_card_number)) {
          ctx.addIssue({ code: "custom", message: "ID card number already submitted.", path: ["id_card_number"] });
        }
      }
    } catch (error) {
      // Handle database errors gracefully
      console.error("Validation error:", error);
      ctx.addIssue({
        code: "custom",
        message: "Validation failed due to server error. Please try again.",
        path: ["root"],
      });
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;