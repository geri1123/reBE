// import { z } from "zod";
// import { SupportedLang } from "../../locales/index.js";

// export const changeUsernameSchema=(language:SupportedLang) => z.object({
//   username: z
//     .string()
//     .min(4, { message: "Username must be at least 4 characters long." }) 
//     .regex(/^[a-zA-Z0-9_]+$/, {
//       message: "Username can only contain letters, numbers, and underscores.",
//     }),
// });

// export type ChangeUsernameBody = z.infer<typeof changeUsernameSchema>;
import { z } from "zod";
import { SupportedLang } from "../../locales/index.js";
import { t } from "../../utils/i18n.js";
export const changeUsernameSchema=(language:SupportedLang) => z.object({
  username: z
    .string()
    .min(4, { message: t("usernameMin", language )}) 
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: t("usernameInvalidChars", language),
    }),
});

export type ChangeUsernameBody = z.infer<typeof changeUsernameSchema>;
