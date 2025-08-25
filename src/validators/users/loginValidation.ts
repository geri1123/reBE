import { z } from "zod";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/translations.js";

export const loginValidation = (language: SupportedLang) =>
  z.object({
    identifier: z.string().nonempty(t("identifierRequired", language)),
    password: z.string().nonempty(t("passwordRequired", language)),
  });

export type LoginRequestData = z.infer<ReturnType<typeof loginValidation>>;