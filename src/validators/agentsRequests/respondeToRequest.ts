import { z } from "zod";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/index.js";

export const respondToRequestSchema = (language: SupportedLang) =>
  z.object({
    requestId: z.number().int().positive(),
    status: z.enum(["approved", "rejected"]),
    reviewNotes: z.string().optional(),
    commissionRate: z
      .number()
      .min(0, t("commissionRateMin", language))
      .max(100, t("commissionRateMax", language))
      .optional(),
  });

export type RespondRequestBody = z.infer<ReturnType<typeof respondToRequestSchema>>;