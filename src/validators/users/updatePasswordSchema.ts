import { z } from "zod";
import { SupportedLang , t } from "../../locales/index.js";


export const changePasswordSchema = (language: SupportedLang) => 
  z.object({
    currentPassword: z.string().min(1, { message: t("currentPasswordRequired", language) }),
    newPassword: z
      .string()
      .min(8, { message: t("newPasswordMinLength", language) })
      .refine(val => !/\s/.test(val), {
        message: t("newPasswordNoSpaces", language),
      }),
    confirmPassword: z.string().min(1, { message: t("confirmPasswordRequired", language) }),
  }).refine(data => data.newPassword === data.confirmPassword, {
    message: t("passwordConfirmationMismatch", language),
    path: ["confirmPassword"],
  });

export type ChangePasswordBody = z.infer<ReturnType<typeof changePasswordSchema>>;


// import { z } from "zod";

// export const changePasswordSchema = z.object({
//   currentPassword: z.string().min(1, { message: "Current password is required." }),
//   newPassword: z
//     .string()
//     .min(8, { message: "New password must be at least 8 characters long." })
//     .refine(val => !/\s/.test(val), {
//       message: "New password must not contain spaces.",
//     }),
//   confirmPassword: z.string().min(1, { message: "Confirm password is required." }),
// }).refine(data => data.newPassword === data.confirmPassword, {
//   message: "New password and confirmation do not match.",
//   path: ["confirmPassword"],
// });

// export type ChangePasswordBody = z.infer<typeof changePasswordSchema>;
