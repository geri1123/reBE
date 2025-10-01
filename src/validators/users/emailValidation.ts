import { z } from "zod";
import {t} from "../../locales/index.js";
import { SupportedLang } from "../../locales/index.js";
export const emailValidation=(language:SupportedLang) => z.object({
  email: z
    .string()
    .trim() 
    .min(1, { message: t("emailRequired", language)})
    .pipe(z.email({ message:t("emailInvalid",language) })),
});

export type EmailValidationRequest = z.infer<typeof emailValidation>;