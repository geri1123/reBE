
// repositories/products/SearchProductRepo.ts
import { PrismaClient } from "@prisma/client";
import { SupportedLang } from "../../locales/index.js";
import { SearchFilters } from "../../types/ProductSearch.js";

export class SearchProductsRepo {
  constructor(private prisma: PrismaClient) {}

  async searchProducts(filters: SearchFilters, language: SupportedLang) {
    const whereConditions: any = this.buildWhereConditions(filters, language);

    // Determine sorting
    let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" }; 
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          orderBy = { price: "asc" };
          break;
        case "price_desc":
          orderBy = { price: "desc" };
          break;
        case "date_asc":
          orderBy = { createdAt: "asc" };
          break;
        case "date_desc":
          orderBy = { createdAt: "desc" };
          break;
      }
    }

    console.log("Repository whereConditions:", JSON.stringify(whereConditions, null, 2));
    console.log("Repository language:", language);

    return this.prisma.product.findMany({
      where: whereConditions,
      take: filters.limit,
      skip: filters.offset,
      orderBy,
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        streetAddress: true,
        createdAt: true,
        updatedAt: true,
        image: { take: 2, select: { imageUrl: true } },
        city: { select: { name: true } },
        subcategory: {
          select: {
            slug: true, // base slug for reference
            subcategorytranslation: {
              where: { language },
              select: { name: true },
              take: 1,
            },
            category: {
              select: {
                slug: true, // base slug for reference
                categorytranslation: {
                  where: { language },
                  select: { name: true },
                  take: 1,
                },
              },
            },
          },
        },
        listingType: {
          select: {
            slug: true, // base slug for reference
            listing_type_translation: {
              where: { language },
              select: { name: true },
              take: 1,
            },
          },
        },
        attributes: {
          select: {
            attribute: {
              select: {
                code: true, // base code for reference
                attributeTranslation: {
                  where: { language },
                  select: { name: true },
                  take: 1, 
                },
              },
            },
            attributeValue: {
              select: {
                value_code: true, // base value_code for reference
                attributeValueTranslations: {
                  where: { language },
                  select: { name: true },
                  take: 1,
                },
              },
            },
          },
        },
        agency: { select: { agency_name: true, logo: true } },
      },
    });
  }

  async getProductsCount(filters: SearchFilters, language: SupportedLang): Promise<number> {
    const whereConditions: any = this.buildWhereConditions(filters, language);
    return this.prisma.product.count({ where: whereConditions });
  }

  private buildWhereConditions(filters: SearchFilters, language: SupportedLang) {
    const whereConditions: any = {};

    /**
     * CATEGORY + SUBCATEGORY
     * Search by translation slugs (categorytranslation.slug and subcategorytranslation.slug)
     */
    if (filters.categorySlug || filters.subcategorySlug) {
      whereConditions.subcategory = {};
      
      // Filter by subcategory translation slug
      if (filters.subcategorySlug) {
        whereConditions.subcategory.subcategorytranslation = {
          some: {
            language,
            slug: filters.subcategorySlug,
          },
        };
      }
      
      // Filter by category translation slug
      if (filters.categorySlug) {
        whereConditions.subcategory.category = {
          categorytranslation: {
            some: {
              language,
              slug: filters.categorySlug,
            },
          },
        };
      }
    }

    /**
     * LISTING TYPE
     * Search by listing type translation slug (listing_type_translation.slug)
     */
    if (filters.listingtype) {
      whereConditions.listingType = {
        listing_type_translation: {
          some: {
            language,
            slug: filters.listingtype,
          },
        },
      };
    }

    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      const attributeConditions: any[] = [];

      for (const [attributeSlug, valueSlug] of Object.entries(filters.attributes)) {
        const valuesArray = Array.isArray(valueSlug) ? valueSlug : [valueSlug];

        attributeConditions.push({
          attributes: {
            some: {
              attribute: {
                attributeTranslation: {
                  some: { 
                    language, 
                    slug: attributeSlug
                  },
                },
              },
              attributeValue: {
                attributeValueTranslations: {
                  some: { 
                    language, 
                    slug: { in: valuesArray } // ✅ Search by attribute_value_translation.slug
                  },
                },
              },
            },
          },
        });
      }

      if (attributeConditions.length > 0) {
        whereConditions.AND = attributeConditions;
      }
    }

    /**
     * PRICE RANGE
     */
    if (filters.pricelow !== undefined || filters.pricehigh !== undefined) {
      whereConditions.price = {};
      if (filters.pricelow !== undefined) whereConditions.price.gte = filters.pricelow;
      if (filters.pricehigh !== undefined) whereConditions.price.lte = filters.pricehigh;
    }

   
    if (filters.city) {
     
     whereConditions.city = {
  name: filters.city.toLocaleLowerCase()
};
      
     
    }

    return whereConditions;
  }
}





// // repositories/products/SearchProductRepo.ts
// import { PrismaClient } from "@prisma/client";
// import { SupportedLang } from "../../locales/index.js";
// import { SearchFilters } from "../../types/ProductSearch.js";

// export class SearchProductsRepo {
//   constructor(private prisma: PrismaClient) {}

//   async searchProducts(filters: SearchFilters, language: SupportedLang) {
//     const whereConditions: any = this.buildWhereConditions(filters );

//     // Determine sorting
//     let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" }; 
//     if (filters.sortBy) {
//       switch (filters.sortBy) {
//         case "price_asc":
//           orderBy = { price: "asc" };
//           break;
//         case "price_desc":
//           orderBy = { price: "desc" };
//           break;
//         case "date_asc":
//           orderBy = { createdAt: "asc" };
//           break;
//         case "date_desc":
//           orderBy = { createdAt: "desc" };
//           break;
//       }
//     }

//     console.log("Repository whereConditions:", JSON.stringify(whereConditions, null, 2));
//     console.log("Repository language:", language);

//     return this.prisma.product.findMany({
//       where: whereConditions,
//       take: filters.limit,
//       skip: filters.offset,
//       orderBy,
//       select: {
//         id: true,
//         title: true,
//         price: true,
//         description: true,
//         streetAddress: true,
//         createdAt: true,
//         updatedAt: true,
//         image: { take: 2, select: { imageUrl: true } },
//         city: { select: { name: true } },
//         subcategory: {
//           select: {
//             slug: true, // base slug for filtering
//             subcategorytranslation: {
//               where: { language },
//               select: { name: true },
//               take: 1, // Ensure we get only one result
//             },
//             category: {
//               select: {
//                 slug: true, // Add category slug for debugging
//                 categorytranslation: {
//                   where: { language },
//                   select: { name: true },
//                   take: 1, // Ensure we get only one result
//                 },
//               },
//             },
//           },
//         },
//         listingType: {
//           select: {
//             slug: true, // Add listing type slug for debugging
//             listing_type_translation: {
//               where: { language },
//               select: { name: true },
//               take: 1, // Ensure we get only one result
//             },
//           },
//         },
//         attributes: {
//           select: {
//             attribute: {
//               select: {
//                 code: true, // Add code for debugging
//                 attributeTranslation: {
//                   where: { language },
//                   select: { name: true },
//                   take: 1, 
//                 },
//               },
//             },
//             attributeValue: {
//               select: {
//                 value_code: true, // Add value_code for debugging
//                 attributeValueTranslations: {
//                   where: { language },
//                   select: { name: true },
//                   take: 1,
//                 },
//               },
//             },
//           },
//         },
//         agency: { select: { agency_name: true, logo: true } },
//       },
//     });
//   }

//   async getProductsCount(filters: SearchFilters, language: SupportedLang): Promise<number> {
//     const whereConditions: any = this.buildWhereConditions(filters);
//     return this.prisma.product.count({ where: whereConditions });
//   }

//   private buildWhereConditions(filters: SearchFilters) {
//     const whereConditions: any = {};

//     // Only add subcategory conditions if we have category or subcategory filters
//     if (filters.categorySlug || filters.subcategorySlug) {
//       whereConditions.subcategory = {};

//       if (filters.subcategorySlug) {
//         whereConditions.subcategory.slug = filters.subcategorySlug;
//       }

//       if (filters.categorySlug && !filters.subcategorySlug) {
//         // Only filter by category if no subcategory is specified
//         whereConditions.subcategory.category = {
//           slug: filters.categorySlug,
//         };
//       }
//     }

//     // Price range filter
//     if (filters.pricelow !== undefined || filters.pricehigh !== undefined) {
//       whereConditions.price = {};
//       if (filters.pricelow !== undefined) whereConditions.price.gte = filters.pricelow;
//       if (filters.pricehigh !== undefined) whereConditions.price.lte = filters.pricehigh;
//     }

//     // City filter - more flexible matching
//     if (filters.city) {
//       whereConditions.city = { 
//         name: filters.city
//       };
//     }
// // if (filters.country) {
// //   whereConditions.city = {
// //     country: { code: filters.country } // or name: filters.country
// //   };
// // }
//     // Listing type filter
//     if (filters.listingtype) {
//       whereConditions.listingType = { slug: filters.listingtype };
//     }

//     // Attributes filter - improved logic
//     if (filters.attributes && Object.keys(filters.attributes).length > 0) {
//       const attributeConditions = [];
//       for (const [attributeCode, valueCode] of Object.entries(filters.attributes)) {
//         if (valueCode !== undefined && valueCode !== null && valueCode !== '') {
//           // Handle array of values (e.g., multiple rooms)
//           if (Array.isArray(valueCode)) {
//             attributeConditions.push({
//               attributes: {
//                 some: {
//                   attribute: { code: attributeCode },
//                   attributeValue: { 
//                     value_code: { 
//                       in: valueCode.filter(v => v && v.trim() !== '') 
//                     } 
//                   },
//                 },
//               },
//             });
//           } else {
//           attributeConditions.push({
//   attributes: {
//     some: {
//       attribute: { code: attributeCode },
//       attributeValue: { value_code: valueCode },
//     },
//   },
// });
//           }
//         }
//       }
//       if (attributeConditions.length > 0) {
//         whereConditions.AND = attributeConditions;
//       }
//     }

//     console.log("Built where conditions:", JSON.stringify(whereConditions, null, 2));

//     return whereConditions;
//   }
// }
