
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
            slug: true, 
            subcategorytranslation: {
              where: { language },
              select: { name: true },
              take: 1,
            },
            category: {
              select: {
                slug: true, 
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
            slug: true, 
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
                code: true,
                attributeTranslation: {
                  where: { language },
                  select: { name: true },
                  take: 1, 
                },
              },
            },
            attributeValue: {
              select: {
                value_code: true, 
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

  if (filters.areaLow !== undefined || filters.areaHigh !== undefined) {
  whereConditions.area = {}; 
  if (filters.areaLow !== undefined) whereConditions.area.gte = filters.areaLow;
  if (filters.areaHigh !== undefined) whereConditions.area.lte = filters.areaHigh;
}
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
                    slug: { in: valuesArray } 
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


