
import { z } from "zod";
import { SupportedLang } from "../../locales/index.js";
import { t } from "../../locales/index.js";
export const changeUsernameSchema=(language:SupportedLang) => z.object({
  username: z
    .string()
    .min(4, { message: t("usernameMin", language )}) 
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: t("usernameInvalidChars", language),
    }),
});

export type ChangeUsernameBody = z.infer<typeof changeUsernameSchema>;
