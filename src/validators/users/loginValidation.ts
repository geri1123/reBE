import { z } from "zod";
import { t } from "../../locales/index.js";
import { SupportedLang } from "../../locales/index.js";

export const loginValidation = (language: SupportedLang) =>
  z.object({
    identifier: z.string().nonempty(t("identifierRequired", language)),
    password: z.string().nonempty(t("passwordRequired", language)),
     rememberMe: z.boolean().optional(), 
  });

export type LoginRequestData = z.infer<ReturnType<typeof loginValidation>>;