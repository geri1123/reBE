import { z } from "zod";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/index.js";

export const resetPasswordValidation = (lang: SupportedLang) =>
  z
    .object({
      token: z.string().min(1, t("tokenRequired", lang)),
      newPassword: z
        .string()
        .min(8, t("newPasswordMinLength", lang))
        .refine((val) => !/\s/.test(val), {
          message: t("newPasswordNoSpaces", lang),
        }),
      repeatPassword: z.string().min(1, t("confirmPasswordRequired", lang)),
    })
    .refine((data) => data.newPassword === data.repeatPassword, {
      path: ["repeatPassword"], // where the error will appear
      message: t("passwordConfirmationMismatch", lang),
    });
export type ResetPasswordBody = z.infer<ReturnType<typeof resetPasswordValidation>>;