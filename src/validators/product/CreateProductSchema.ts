import { z } from "zod";
import { t } from "../../utils/i18n.js";
import { SupportedLang } from "../../locales/index.js";

// Zod schema with multilingual messages


export const createProductSchema = (language: SupportedLang) =>
  z.object({
    title: z.string(t("title", language)).min(1, t("title", language)),
    price: z.preprocess(val => Number(val), 
      z.number(t("price", language)).refine(v => v > 0, t("pricePositive", language))
    ),
    cityId: z.preprocess(val => Number(val), z.number(t("cityId", language))),
    subcategoryId: z.preprocess(val => Number(val), z.number(t("subcategoryId", language))),
    listingTypeId: z.preprocess(val => Number(val), z.number(t("listingTypeId", language))),
    description: z.string().optional(),
  attributes: z.preprocess((val) => {
  if (!val) return undefined;            
  if (typeof val === "string") val = JSON.parse(val); 
  return Array.isArray(val) ? val : [val]; 
}, z.array(
  z.object({
    attributeId: z.number(t("attribute", language)),
    attributeValueId: z.number(t("attributeValue", language)),
  })
).optional())
  });