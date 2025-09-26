// validators/users/authValidatorAsync.ts
import { z, RefinementCtx } from "zod";
import { prisma } from "../../config/prisma.js";
import { UserRepositoryPrisma } from "../../repositories/user/UserRepositoryPrisma.js";
import { AgencyRepository } from "../../repositories/agency/AgencyRepository.js";
import { RegistrationRequestRepository } from "../../repositories/registrationRequest/RegistrationRequest.js";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/index.js";

const userRepo = new UserRepositoryPrisma(prisma);
const agencyRepo = new AgencyRepository(prisma);
const registrationRequestRepo = new RegistrationRequestRepository(prisma);

export const registrationSchema = (language: SupportedLang) =>
  z
    .object({
      // Common fields
      username: z
        .string()
        .min(4, t("usernameMin", language))
        .refine((val) => !/\s/.test(val), t("usernameNoSpaces", language)),
      email: z.string().email(t("emailInvalid", language)),
      password: z
        .string()
        .min(8, t("passwordMin", language))
        .refine((val) => !/\s/.test(val), t("passwordNoSpaces", language)),
      repeatPassword: z.string(),
      first_name: z.string().min(1, t("firstNameRequired", language)),
      last_name: z.string().min(1, t("lastNameRequired", language)),
      terms_accepted: z.literal(true, { message: t("termsRequired", language) }),
      role: z.enum(["user", "agency_owner", "agent"]),

      // Agency owner fields (required only if role === agency_owner)
      agency_name: z.string().min(1, t("agencyNameRequired", language)).optional(),
      license_number: z.string().min(1, t("licenseRequired", language)).optional(),
      address: z.string().min(1, t("addressRequired", language)).optional(),

      // Agent fields (required only if role === agent)
      public_code: z.string().min(1, t("publicCodeRequired", language)).optional(),
      id_card_number: z.string().min(1, t("idCardRequired", language)).optional(),
      requested_role: z
        .enum(["agent", "senior_agent", "team_lead"], {
          message: t("agencyRoleRequired", language),
        })
        .optional(),
    })
    .superRefine(async (data, ctx: RefinementCtx) => {
      // Cross-field validation
      if (data.password !== data.repeatPassword) {
        ctx.addIssue({
          code: "custom",
          message: t("passwordsMismatch", language),
          path: ["repeatPassword"],
        });
      }

      // Role-specific required fields
      if (data.role === "agency_owner") {
        if (!data.agency_name?.trim()) {
          ctx.addIssue({
            code: "custom",
            message: t("agencyNameRequired", language),
            path: ["agency_name"],
          });
        }
        if (!data.license_number?.trim()) {
          ctx.addIssue({
            code: "custom",
            message: t("licenseRequired", language),
            path: ["license_number"],
          });
        }
        if (!data.address?.trim()) {
          ctx.addIssue({
            code: "custom",
            message: t("addressRequired", language),
            path: ["address"],
          });
        }
      }

      if (data.role === "agent") {
        if (!data.public_code?.trim()) {
          ctx.addIssue({
            code: "custom",
            message: t("publicCodeRequired", language),
            path: ["public_code"],
          });
        }
        if (!data.id_card_number?.trim()) {
          ctx.addIssue({
            code: "custom",
            message: t("idCardRequired", language),
            path: ["id_card_number"],
          });
        }
        if (!data.requested_role) {
          ctx.addIssue({
            code: "custom",
            message: t("agencyRoleRequired", language),
            path: ["requested_role"],
          });
        }
      }

      // Async DB validations
      try {
        if (await userRepo.emailExists(data.email)) {
          ctx.addIssue({
            code: "custom",
            message: t("emailExists", language),
            path: ["email"],
          });
        }

        if (await userRepo.usernameExists(data.username)) {
          ctx.addIssue({
            code: "custom",
            message: t("usernameExists", language),
            path: ["username"],
          });
        }

        if (data.role === "agency_owner") {
          if (data.agency_name && await agencyRepo.agencyNameExist(data.agency_name)) {
            ctx.addIssue({
              code: "custom",
              message: t("agencyExists", language),
              path: ["agency_name"],
            });
          }
          if (data.license_number && await agencyRepo.licenseExists(data.license_number)) {
            ctx.addIssue({
              code: "custom",
              message: t("licenseExists", language),
              path: ["license_number"],
            });
          }
        }

        if (data.role === "agent") {
          if (data.public_code) {
            const agency = await agencyRepo.findByPublicCode(data.public_code);
            if (!agency) {
              ctx.addIssue({
                code: "custom",
                message: t("invalidPublicCode", language),
                path: ["public_code"],
              });
            }
          }
          if (data.id_card_number && await registrationRequestRepo.idCardExists(data.id_card_number)) {
            ctx.addIssue({
              code: "custom",
              message: t("idCardExists", language),
              path: ["id_card_number"],
            });
          }
        }
      } catch (error) {
        console.error("Validation error:", error);
        ctx.addIssue({
          code: "custom",
          message: t("validationServerError", language),
          path: ["root"],
        });
      }
    });

export type RegistrationData = z.infer<ReturnType<typeof registrationSchema>>;
