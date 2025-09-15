import { PrismaClient } from "@prisma/client";
import { SupportedLang } from "../../locales/index.js";
import { SearchFilters } from "../../types/ProductSearch.js";

export class SearchProductsRepo {
  constructor(private prisma: PrismaClient) {}

  async searchProducts(filters: SearchFilters, language: SupportedLang) {
    const whereConditions: any = this.buildWhereConditions(filters);

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
            slug: true, // base slug for filtering
            subcategorytranslation: {
              where: { language },
              select: { name: true }, // we remove slug
            },
            category: {
              select: {
                categorytranslation: {
                  where: { language },
                  select: { name: true }, // remove slug
                },
              },
            },
          },
        },
        listingType: {
          select: {
            listing_type_translation: {
              where: { language },
              select: { name: true }, // remove slug
            },
          },
        },
        attributes: {
          select: {
            attribute: {
              select: {
                attributeTranslation: {
                  where: { language },
                  select: { name: true }, // remove slug & code
                },
              },
            },
            attributeValue: {
              select: {
                attributeValueTranslations: {
                  where: { language },
                  select: { name: true }, // remove slug & value_code
                },
              },
            },
          },
        },
        agency: { select: { agency_name: true, logo: true } }, // keep agency
      },
    });
  }

  async getProductsCount(filters: SearchFilters, language: SupportedLang): Promise<number> {
    const whereConditions: any = this.buildWhereConditions(filters);
    return this.prisma.product.count({ where: whereConditions });
  }

  private buildWhereConditions(filters: SearchFilters) {
    const whereConditions: any = {};

    if (filters.categorySlug || filters.subcategorySlug) {
      whereConditions.subcategory = {};

      if (filters.subcategorySlug) {
        whereConditions.subcategory.slug = filters.subcategorySlug;
      }

      if (filters.categorySlug) {
        whereConditions.subcategory.category = {
          slug: filters.categorySlug,
        };
      }
    }

    if (filters.pricelow !== undefined || filters.pricehigh !== undefined) {
      whereConditions.price = {};
      if (filters.pricelow !== undefined) whereConditions.price.gte = filters.pricelow;
      if (filters.pricehigh !== undefined) whereConditions.price.lte = filters.pricehigh;
    }

    if (filters.city) {
      whereConditions.city = { name: { equals: filters.city } };
    }

    if (filters.listingtype) {
      whereConditions.listingType = { slug: filters.listingtype };
    }

    if (filters.attributes && Object.keys(filters.attributes).length > 0) {
      const attributeConditions = [];
      for (const [attributeCode, valueCode] of Object.entries(filters.attributes)) {
        attributeConditions.push({
          attributes: {
            some: {
              attribute: { code: attributeCode },
              attributeValue: { value_code: valueCode },
            },
          },
        });
      }
      if (attributeConditions.length > 0) whereConditions.AND = attributeConditions;
    }

    return whereConditions;
  }
}