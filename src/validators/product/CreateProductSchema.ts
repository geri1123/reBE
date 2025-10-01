import { z } from "zod";
import { t } from "../../locales/index.js";
import { SupportedLang } from "../../locales/index.js";

export const createProductSchema = (language: SupportedLang) =>
  z.object({
    title: z.string(t("title", language)).min(1, t("title", language)),
    price: z.preprocess(val => Number(val), 
      z.number(t("price", language)).refine(v => v > 0, t("pricePositive", language))
    ),
    cityId: z.preprocess(
      val => val === "" || val == null ? NaN : Number(val),
      z.number({ message: t("cityId", language) }).refine(val => !isNaN(val) && val > 0, { message: t("cityId", language) })
    ),
    subcategoryId: z.preprocess(val => Number(val), z.number(t("subcategoryId", language))),
    listingTypeId: z.preprocess(val => Number(val), z.number(t("listingTypeId", language))),
    
    description: z.string().optional().default(""),
    address: z.string().optional().default(""),

 area: z.preprocess(val => {
  if (val === "" || val == null) return 0; // default 0
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}, z.number()),

    buildYear: z.preprocess(val => {
      if (val === "" || val == null) return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    }, z.number({
      message: t("buildYear", language)
    })
    .int({ message: t("buildYearInt", language) })
    .min(1900, { message: t("buildYearMin", language) })
    .max(new Date().getFullYear(), { message: t("buildYearMax", language) })
    .nullable()
    .optional()),

    attributes: z.preprocess(val => {
      if (!val) return undefined;
      if (typeof val === "string") val = JSON.parse(val);
      return Array.isArray(val) ? val : [val];
    }, z.array(z.object({
      attributeId: z.number(t("attribute", language)),
      attributeValueId: z.number(t("attributeValue", language)),
    })).optional())
  });


// import { z } from "zod";
// import { t } from "../../utils/i18n.js";
// import { SupportedLang } from "../../locales/index.js";

// // Zod schema with multilingual messages


// export const createProductSchema = (language: SupportedLang) =>
//   z.object({
//     title: z.string(t("title", language)).min(1, t("title", language)),
//     price: z.preprocess(val => Number(val), 
//       z.number(t("price", language)).refine(v => v > 0, t("pricePositive", language))
//     ),
  
// cityId: z.preprocess(
//       val => {
//         if (val === "" || val === null || val === undefined) return NaN;
//         return Number(val);
//       },
//       z.number({ message: t("cityId", language) }).refine(
//         val => !isNaN(val) && val > 0,
//         { message: t("cityId", language) }
//       )
//     ),
//      buildYear: z.preprocess(
//   val => {
//     if (val === "" || val === undefined || val === null) return null;
//     const num = Number(val);
//     return isNaN(num) ? null : num;
//   },
//   z.number({
//     message: t("buildYear", language), // multilingual message
//   })
//   .int({ message: t("buildYearInt", language) }) // optional: enforce integer
//   .min(1900, { message: t("buildYearMin", language) })
//   .max(new Date().getFullYear(), { message: t("buildYearMax", language) })
//   .nullable()
//   .optional()
// ),
//     subcategoryId: z.preprocess(val => Number(val), z.number(t("subcategoryId", language))),
//     listingTypeId: z.preprocess(val => Number(val), z.number(t("listingTypeId", language))),
//     description: z.string().optional(),
//     area: z.preprocess(
//   val => {
//     if (val === "" || val === undefined || val === null) return null; 
//     const num = Number(val);
//     return isNaN(num) ? null : num;
//   },
//   z.number().nullable()
// ).optional(),

//     streetAddress: z.string().optional(),
//   attributes: z.preprocess((val) => {
//   if (!val) return undefined;            
//   if (typeof val === "string") val = JSON.parse(val); 
//   return Array.isArray(val) ? val : [val]; 
// }, z.array(
//   z.object({
//     attributeId: z.number(t("attribute", language)),
//     attributeValueId: z.number(t("attributeValue", language)),
//   })
  
// ).optional())
//   });