import { z } from "zod";

export const updateProfileSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }).optional(),
    lastName: z.string().min(1, { message: "Last name is required" }).optional(),
    aboutMe: z.string().min(1, { message: "About me cannot be empty" }).optional(),
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

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
