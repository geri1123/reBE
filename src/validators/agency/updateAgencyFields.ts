import { z } from "zod";

export const updateAgencySchema = z
  .object({
    name: z.string().min(1, { message: "Agency name is required" }).optional(),
      agency_email: z
      .union([z.string().min(1, "Agency email is required").pipe(z.email("Invalid email address")), z.undefined()])
      .optional(),
    website: z.string().min(1, { message: "Website cannot be empty" }).optional(),
    address: z.string().min(1, { message: "Agency address is required" }).optional(),
    phone: z
      .string()
      .min(6, { message: "Phone number must be at least 6 digits." })
      .max(15, { message: "Phone number must be at most 15 digits." })
      .regex(/^\+?[0-9\s\-()]*$/, {
        message: "Phone number contains invalid characters.",
      })
      .optional(),
  })
  .refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export type updateAgencySchema = z.infer<typeof updateAgencySchema>;
