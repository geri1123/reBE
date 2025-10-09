import { SupportedLang } from "../../locales/index.js";
import { CategoryRepository } from "../../repositories/category/categoryRepository.js";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo.js";
import { AttributeRepo } from "../../repositories/attributes/attributesRepo.js";
import {
  getCategoriesFromCache,
  setCategoriesCache,
  getListingTypesFromCache,
  setListingTypesCache,
  getAttributesFromCache,
  setAttributesCache,
} from "../../cache/filtersCache.js";

interface TranslateUrlRequest {
  pathname: string;
  searchParams: Record<string, string>;
  sourceLang: SupportedLang;
  targetLang: SupportedLang;
}

export class TranslationService {
  constructor(
    private categoryRepo: CategoryRepository,
    private listingTypeRepo: ListingTypeRepo,
    private attributeRepo: AttributeRepo
  ) {}

  async translateUrl(data: TranslateUrlRequest): Promise<string> {
    const { pathname, searchParams, sourceLang, targetLang } = data;

    // Parse URL segments
    const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);

    // Remove language prefix if exists
    const urlSegments = segments[0] === sourceLang ? segments.slice(1) : segments;

    if (urlSegments[0] !== "products") {
      return this.buildSimpleUrl(urlSegments, searchParams, targetLang);
    }

    // Products page - complex translation
    return this.translateProductsUrl(urlSegments, searchParams, sourceLang, targetLang);
  }

  private buildSimpleUrl(
    segments: string[],
    searchParams: Record<string, string>,
    targetLang: SupportedLang
  ): string {
    const translatedPath =
      targetLang === "en" ? `/${segments.join("/")}` : `/${targetLang}/${segments.join("/")}`;

    const queryString = new URLSearchParams(searchParams).toString();
    return `${translatedPath}${queryString ? `?${queryString}` : ""}`;
  }

  private async translateProductsUrl(
    segments: string[],
    searchParams: Record<string, string>,
    sourceLang: SupportedLang,
    targetLang: SupportedLang
  ): Promise<string> {
    // Get cached data (or fetch if needed)
    const [sourceCategories, targetCategories, sourceListingTypes, targetListingTypes] =
      await Promise.all([
        this.getCategoriesForLang(sourceLang),
        this.getCategoriesForLang(targetLang),
        this.getListingTypesForLang(sourceLang),
        this.getListingTypesForLang(targetLang),
      ]);

    // Translate path segments
    const translatedSegments = this.translatePathSegments(
      segments,
      sourceCategories,
      targetCategories
    );

    // Translate query parameters
    const subcategoryId = this.findSubcategoryId(segments, sourceCategories);
    
    const hasAttributeParams = this.hasAttributeParams(searchParams);
    
    const translatedParams = hasAttributeParams && subcategoryId
      ? await this.translateQueryParams(
          searchParams,
          subcategoryId,
          sourceLang,
          targetLang,
          sourceListingTypes,
          targetListingTypes
        )
      : this.translateSimpleParams(searchParams, sourceListingTypes, targetListingTypes);
const path = "/" + translatedSegments.join("/");
const finalPath = targetLang === "al" ? path : `/${targetLang}${path}`;

// ✅ Improved query string builder — preserves commas for city and attributes
const nonEncodedKeys = ["city", "country", "page", "sort", "query"];

const queryString = Object.entries(translatedParams)
  .map(([key, rawValue]) => {
    if (rawValue === undefined || rawValue === null || rawValue === "") return null;

    // Normalize arrays → comma-separated string
    let value: string;
    if (Array.isArray(rawValue)) {
      value = rawValue.join(",");
    } else {
      value = String(rawValue);
    }

    // Keep commas literal for city, country, and attributes with multiple selections
    if (nonEncodedKeys.includes(key) || value.includes(",")) {
      return `${encodeURIComponent(key)}=${value}`;
    }

    // Default encoding
    return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  })
  .filter(Boolean)
  .join("&");

return `${finalPath}${queryString ? `?${queryString}` : ""}`;
    // Build final URL
    // const path = "/" + translatedSegments.join("/");
    // const finalPath = targetLang === "al" ? path : `/${targetLang}${path}`;

    // // Custom query string handling
    // const queryString = Object.entries(translatedParams)
    //   .map(([key, value]) => {
    //     if (key === "city") {
    //       // Keep literal commas for city parameter
    //       return `${encodeURIComponent(key)}=${value}`;
    //     }
    //     return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    //   })
    //   .join("&");

    // return `${finalPath}${queryString ? `?${queryString}` : ""}`;
  }

  private async getCategoriesForLang(lang: SupportedLang) {
    let categories = getCategoriesFromCache(lang);
    if (!categories) {
      categories = await this.categoryRepo.getAllCategories(lang);
      setCategoriesCache(lang, categories);
    }
    return categories;
  }

  private async getListingTypesForLang(lang: SupportedLang) {
    let listingTypes = getListingTypesFromCache(lang);
    if (!listingTypes) {
      listingTypes = await this.listingTypeRepo.getAllListingTypes(lang, "active");
      setListingTypesCache(lang, listingTypes);
    }
    return listingTypes;
  }

  private translatePathSegments(
    segments: string[],
    sourceCategories: any[],
    targetCategories: any[]
  ): string[] {
    const result = ["products"];

    if (segments.length < 2) return result;

    // Translate category
    const categorySlug = segments[1];
    const category = sourceCategories.find((c) => c.slug === categorySlug);

    if (category) {
      const targetCategory = targetCategories.find((c) => c.id === category.id);
      result.push(targetCategory?.slug || categorySlug);

      // Translate subcategory
      if (segments.length >= 3) {
        const subcategorySlug = segments[2];
        const subcategory = category.subcategories?.find((s: any) => s.slug === subcategorySlug);

        if (subcategory) {
          const targetCat = targetCategories.find((c) => c.id === category.id);
          const targetSubcategory = targetCat?.subcategories?.find(
            (s: any) => s.id === subcategory.id
          );
          result.push(targetSubcategory?.slug || subcategorySlug);
        } else {
          result.push(subcategorySlug);
        }
      }
    } else {
      result.push(categorySlug);
      if (segments.length >= 3) result.push(segments[2]);
    }

    // Add remaining segments
    if (segments.length > 3) {
      result.push(...segments.slice(3));
    }

    return result;
  }

  private findSubcategoryId(segments: string[], categories: any[]): number | null {
    if (segments.length < 3) return null;

    const categorySlug = segments[1];
    const subcategorySlug = segments[2];

    const category = categories.find((c) => c.slug === categorySlug);
    if (!category) return null;

    const subcategory = category.subcategories?.find((s: any) => s.slug === subcategorySlug);
    return subcategory?.id || null;
  }

  private hasAttributeParams(params: Record<string, string>): boolean {
    const keys = Object.keys(params);
    // Exclude non-attribute params
    const nonAttributeKeys = ['listingtype', 'page', 'sort', 'city', 'query'];
    return keys.some(key => !nonAttributeKeys.includes(key));
  }

  private translateSimpleParams(
    params: Record<string, string>,
    sourceListingTypes: any[],
    targetListingTypes: any[]
  ): Record<string, string> {
    const result: Record<string, string> = {};

    for (const [key, value] of Object.entries(params)) {
      if (key === "listingtype") {
        const listingType = sourceListingTypes.find((lt) => lt.slug === value);
        if (listingType) {
          const target = targetListingTypes.find((lt) => lt.id === listingType.id);
          result[key] = target?.slug || value;
        } else {
          result[key] = value;
        }
      } else {
        // Keep as-is if we can't translate
        result[key] = value;
      }
    }

    return result;
  }

  private async translateQueryParams(
    params: Record<string, string>,
    subcategoryId: number,
    sourceLang: SupportedLang,
    targetLang: SupportedLang,
    sourceListingTypes: any[],
    targetListingTypes: any[]
  ): Promise<Record<string, string>> {
    const result: Record<string, string> = {};

    // Get attributes for this specific subcategory
    const [sourceAttributes, targetAttributes] = await Promise.all([
      this.getAttributesForSubcategory(subcategoryId, sourceLang),
      this.getAttributesForSubcategory(subcategoryId, targetLang),
    ]);

    console.log('🔍 Translation Debug:', {
      subcategoryId,
      sourceLang,
      targetLang,
      sourceAttributesCount: sourceAttributes.length,
      targetAttributesCount: targetAttributes.length,
      params
    });

    // Translate each parameter
    for (const [key, value] of Object.entries(params)) {
      if (key === "listingtype") {
        const listingType = sourceListingTypes.find((lt) => lt.slug === value);
        if (listingType) {
          const target = targetListingTypes.find((lt) => lt.id === listingType.id);
          result[key] = target?.slug || value;
        } else {
          result[key] = value;
        }
      } else if (key === "city" || key === "page" || key === "sort" || key === "query") {
        // Pass through non-attribute params unchanged
        result[key] = value;
      } else {
        // Try to translate as attribute
        const translated = this.translateAttribute(key, value, sourceAttributes, targetAttributes);
        if (translated) {
          console.log(` Translated attribute: ${key}=${value} → ${translated.key}=${translated.value}`);
          result[translated.key] = translated.value;
        } else {
          console.log(` Could not translate attribute: ${key}=${value}`);
          result[key] = value;
        }
      }
    }

    return result;
  }

  private async getAttributesForSubcategory(subcategoryId: number, lang: SupportedLang) {
    const cacheKey = `${subcategoryId}:${lang}`;
    let attributes = getAttributesFromCache(cacheKey);

    if (!attributes) {
      attributes = await this.attributeRepo.getAttributesBySubcategoryId(subcategoryId, lang);
      setAttributesCache(cacheKey, attributes);
    }

    return attributes;
  }

  private translateAttribute(
    key: string,
    value: string,
    sourceAttributes: any[],
    targetAttributes: any[]
  ): { key: string; value: string } | null {
    // Find source attribute by slug
    const sourceAttr = sourceAttributes.find((attr) => attr.slug === key);
    
    if (!sourceAttr) {
      console.log(` Source attribute not found for slug: ${key}`);
      return null;
    }

    console.log(`🔎 Found source attribute:`, {
      id: sourceAttr.id,
      slug: sourceAttr.slug,
      name: sourceAttr.name,
      valuesCount: sourceAttr.values?.length || 0
    });

    // Find target attribute by ID
    const targetAttr = targetAttributes.find((attr) => attr.id === sourceAttr.id);
    
    if (!targetAttr) {
      console.log(` Target attribute not found for id: ${sourceAttr.id}`);
      return null;
    }

    console.log(` Found target attribute:`, {
      id: targetAttr.id,
      slug: targetAttr.slug,
      name: targetAttr.name,
      valuesCount: targetAttr.values?.length || 0
    });

    // Split comma-separated values and translate each
    const values = value.split(",").map(v => v.trim());
    
    const translatedValues = values.map(val => {
      const sourceValue = sourceAttr.values?.find((v: any) => v.slug === val);
      
      if (!sourceValue) {
        console.log(` Source value not found: ${val}`);
        return val;
      }

      console.log(`🔎 Found source value:`, {
        id: sourceValue.id,
        slug: sourceValue.slug,
        name: sourceValue.name
      });

      const targetValue = targetAttr.values?.find((v: any) => v.id === sourceValue.id);
      
      if (!targetValue) {
        console.log(`Target value not found for id: ${sourceValue.id}`);
        return val;
      }

      console.log(` Found target value:`, {
        id: targetValue.id,
        slug: targetValue.slug,
        name: targetValue.name
      });

      return targetValue.slug ?? val;
    });

    return {
      key: targetAttr.slug ?? key,
      value: translatedValues.join(","),
    };
  }
}
// import { SupportedLang } from "../../locales/index.js";
// import { CategoryRepository } from "../../repositories/category/categoryRepository.js";
// import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo.js";
// import { AttributeRepo } from "../../repositories/attributes/attributesRepo.js";
// import {
//   getCategoriesFromCache,
//   setCategoriesCache,
//   getListingTypesFromCache,
//   setListingTypesCache,
//   getAttributesFromCache,
//   setAttributesCache,
// } from "../../cache/filtersCache.js";

// interface TranslateUrlRequest {
//   pathname: string;
//   searchParams: Record<string, string>;
//   sourceLang: SupportedLang;
//   targetLang: SupportedLang;
// }

// export class TranslationService {
//   constructor(
//     private categoryRepo: CategoryRepository,
//     private listingTypeRepo: ListingTypeRepo,
//     private attributeRepo: AttributeRepo
//   ) {}

//   async translateUrl(data: TranslateUrlRequest): Promise<string> {
//     const { pathname, searchParams, sourceLang, targetLang } = data;

//     // Parse URL segments
//     const segments = pathname.replace(/^\//, "").split("/").filter(Boolean);

//     // Remove language prefix if exists
//     const urlSegments = segments[0] === sourceLang ? segments.slice(1) : segments;


//     if (urlSegments[0] !== "products") {
//       return this.buildSimpleUrl(urlSegments, searchParams, targetLang);
//     }

//     // Products page - complex translation
//     return this.translateProductsUrl(urlSegments, searchParams, sourceLang, targetLang);
//   }

//   private buildSimpleUrl(
//     segments: string[],
//     searchParams: Record<string, string>,
//     targetLang: SupportedLang
//   ): string {
//     const translatedPath =
//       targetLang === "en" ? `/${segments.join("/")}` : `/${targetLang}/${segments.join("/")}`;

//     const queryString = new URLSearchParams(searchParams).toString();
//     return `${translatedPath}${queryString ? `?${queryString}` : ""}`;
//   }

//   private async translateProductsUrl(
//     segments: string[],
//     searchParams: Record<string, string>,
//     sourceLang: SupportedLang,
//     targetLang: SupportedLang
//   ): Promise<string> {
//     // Get cached data (or fetch if needed)
//     const [sourceCategories, targetCategories, sourceListingTypes, targetListingTypes] =
//       await Promise.all([
//         this.getCategoriesForLang(sourceLang),
//         this.getCategoriesForLang(targetLang),
//         this.getListingTypesForLang(sourceLang),
//         this.getListingTypesForLang(targetLang),
//       ]);

//     // Translate path segments
//     const translatedSegments = this.translatePathSegments(
//       segments,
//       sourceCategories,
//       targetCategories
//     );

//     // Translate query parameters
//     const subcategoryId = this.findSubcategoryId(segments, sourceCategories);
    
//     const hasAttributeParams = this.hasAttributeParams(searchParams);
    
//     const translatedParams = hasAttributeParams && subcategoryId
//       ? await this.translateQueryParams(
//           searchParams,
//           subcategoryId,
//           sourceLang,
//           targetLang,
//           sourceListingTypes,
//           targetListingTypes
//         )
//       : this.translateSimpleParams(searchParams, sourceListingTypes, targetListingTypes);

//     // Build final URL
//     // const path = "/" + translatedSegments.join("/");
//     // const finalPath = targetLang === "en" ? path : `/${targetLang}${path}`;
//     // const queryString = new URLSearchParams(translatedParams).toString();

//     // return `${finalPath}${queryString ? `?${queryString}` : ""}`;
//     const path = "/" + translatedSegments.join("/");
// const finalPath = targetLang === "al" ? path : `/${targetLang}${path}`;

// // Custom query string handling
// const queryString = Object.entries(translatedParams)
//   .map(([key, value]) => {
//     if (key === "city") {
//       // Keep literal commas
//       return `${encodeURIComponent(key)}=${value}`;
//     }
//     return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
//   })
//   .join("&");

// return `${finalPath}${queryString ? `?${queryString}` : ""}`;
//   }

//   private async getCategoriesForLang(lang: SupportedLang) {
//     let categories = getCategoriesFromCache(lang);
//     if (!categories) {
//       categories = await this.categoryRepo.getAllCategories(lang);
//       setCategoriesCache(lang, categories);
//     }
//     return categories;
//   }

//   private async getListingTypesForLang(lang: SupportedLang) {
//     let listingTypes = getListingTypesFromCache(lang);
//     if (!listingTypes) {
//       listingTypes = await this.listingTypeRepo.getAllListingTypes(lang,"active");
//       setListingTypesCache(lang, listingTypes);
//     }
//     return listingTypes;
//   }

//   private translatePathSegments(
//     segments: string[],
//     sourceCategories: any[],
//     targetCategories: any[]
//   ): string[] {
//     const result = ["products"];

//     if (segments.length < 2) return result;

//     // Translate category
//     const categorySlug = segments[1];
//     const category = sourceCategories.find((c) => c.slug === categorySlug);

//     if (category) {
//       const targetCategory = targetCategories.find((c) => c.id === category.id);
//       result.push(targetCategory?.slug || categorySlug);

//       // Translate subcategory
//       if (segments.length >= 3) {
//         const subcategorySlug = segments[2];
//         const subcategory = category.subcategories?.find((s: any) => s.slug === subcategorySlug);

//         if (subcategory) {
//           const targetCat = targetCategories.find((c) => c.id === category.id);
//           const targetSubcategory = targetCat?.subcategories?.find(
//             (s: any) => s.id === subcategory.id
//           );
//           result.push(targetSubcategory?.slug || subcategorySlug);
//         } else {
//           result.push(subcategorySlug);
//         }
//       }
//     } else {
//       result.push(categorySlug);
//       if (segments.length >= 3) result.push(segments[2]);
//     }

//     // Add remaining segments
//     if (segments.length > 3) {
//       result.push(...segments.slice(3));
//     }

//     return result;
//   }

//   // NEW: Check if query params contain attributes (not just listingtype)
//   private hasAttributeParams(params: Record<string, string>): boolean {
//     const keys = Object.keys(params);
//     // If only listingtype, no need to fetch attributes
//     return keys.length > 0 && keys.some(key => key !== 'listingtype');
//   }

//   // NEW: Simple translation without fetching attributes
//   private translateSimpleParams(
//     params: Record<string, string>,
//     sourceListingTypes: any[],
//     targetListingTypes: any[]
//   ): Record<string, string> {
//     const result: Record<string, string> = {};

//     for (const [key, value] of Object.entries(params)) {
//       if (key === "listingtype") {
//         const listingType = sourceListingTypes.find((lt) => lt.slug === value);
//         if (listingType) {
//           const target = targetListingTypes.find((lt) => lt.id === listingType.id);
//           result[key] = target?.slug || value;
//         } else {
//           result[key] = value;
//         }
//       } else {
//         // Keep as-is if we can't translate
//         result[key] = value;
//       }
//     }

//     return result;
//   }

//   private async translateQueryParams(
//     params: Record<string, string>,
//     subcategoryId: number,
//     sourceLang: SupportedLang,
//     targetLang: SupportedLang,
//     sourceListingTypes: any[],
//     targetListingTypes: any[]
//   ): Promise<Record<string, string>> {
//     const result: Record<string, string> = {};

//     // Get attributes for this specific subcategory
//     const [sourceAttributes, targetAttributes] = await Promise.all([
//       this.getAttributesForSubcategory(subcategoryId, sourceLang),
//       this.getAttributesForSubcategory(subcategoryId, targetLang),
//     ]);

//     // Translate each parameter
//     for (const [key, value] of Object.entries(params)) {
//       if (key === "listingtype") {
//         const listingType = sourceListingTypes.find((lt) => lt.slug === value);
//         if (listingType) {
//           const target = targetListingTypes.find((lt) => lt.id === listingType.id);
//           result[key] = target?.slug || value;
//         } else {
//           result[key] = value;
//         }
//       } else {
//         // Try to translate as attribute
//         const translated = this.translateAttribute(key, value, sourceAttributes, targetAttributes);
//         if (translated) {
//           result[translated.key] = translated.value;
//         } else {
//           result[key] = value;
//         }
//       }
//     }

//     return result;
//   }

//   private async getAttributesForSubcategory(subcategoryId: number, lang: SupportedLang) {
//     const cacheKey = `${subcategoryId}:${lang}`;
//     let attributes = getAttributesFromCache(cacheKey);

//     if (!attributes) {
//       attributes = await this.attributeRepo.getAttributesBySubcategoryId(subcategoryId, lang);
//       setAttributesCache(cacheKey, attributes);
//     }

//     return attributes;
//   }
//  private translateAttribute(
//   key: string,
//   value: string, 
//   sourceAttributes: any[],
//   targetAttributes: any[]
// ): { key: string; value: string } | null {
//   const sourceAttr = sourceAttributes.find((attr) => attr.slug === key);
//   if (!sourceAttr) return null;

//   const values = value.split(",").map(v => v.trim());

//   // Find targetAttr once by ID
//   const targetAttr = targetAttributes.find(attr => attr.id === sourceAttr.id);
//   if (!targetAttr) return null;

//   const translatedValues = values.map(val => {
//     const sourceValue = sourceAttr.values?.find((v: any) => v.slug === val);
//     if (!sourceValue) return val;

//     const targetValue = targetAttr.values?.find((v: any) => v.id === sourceValue.id);
//     return targetValue?.slug ?? val;
//   });

//   return {
//     key: targetAttr.slug ?? key, // now accessible
//     value: translatedValues.join(","),
//   };
// }

// private translateAttribute(
//   key: string,
//   value: string, // could be comma-separated
//   sourceAttributes: any[],
//   targetAttributes: any[]
// ): { key: string; value: string } | null {
//   const sourceAttr = sourceAttributes.find((attr) => attr.slug === key);
//   if (!sourceAttr) return null;

//   const values = value.split(",").map(v => v.trim());

//   const translatedValues = values.map(val => {
//     const sourceValue = sourceAttr.values?.find((v:any) => v.slug === val);
//     if (!sourceValue) return val; // fallback to original

//     const targetAttr = targetAttributes.find(attr => attr.slug === key);
//     if (!targetAttr) return val;

//     const targetValue = targetAttr.values?.find((v:any) => v.slug === sourceValue.slug);
//     return targetValue?.slug ?? val;
//   });

//   return {
//     key: key, 
//     value: translatedValues.join(","), 
//   };
// }
  

//   private findSubcategoryId(segments: string[], categories: any[]): number | null {
//     if (segments.length < 3) return null;

//     const categorySlug = segments[1];
//     const subcategorySlug = segments[2];

//     const category = categories.find((c) => c.slug === categorySlug);
//     if (!category) return null;

//     const subcategory = category.subcategories?.find((s: any) => s.slug === subcategorySlug);
//     return subcategory?.id || null;
//   }
// }
// private translateAttribute(
  //   key: string,
  //   value: string,
  //   sourceAttributes: any[],
  //   targetAttributes: any[]
  // ): { key: string; value: string } | null {
  //   const sourceAttr = sourceAttributes.find((attr) => attr.slug === key);
  //   if (!sourceAttr) return null;

  //   const sourceValue = sourceAttr.values?.find((v: any) => v.slug === value);
  //   if (!sourceValue) return null;

  //   const targetAttr = targetAttributes.find((attr) => attr.id === sourceAttr.id);
  //   if (!targetAttr) return null;

  //   const targetValue = targetAttr.values?.find((v: any) => v.id === sourceValue.id);
  //   if (!targetValue) return null;

  //   return {
  //     key: targetAttr.slug,
  //     value: targetValue.slug,
  //   };
  // }