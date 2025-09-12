// repositories/products/SearchProductsRepo.ts
import { PrismaClient } from "@prisma/client";
import { SupportedLang } from "../../locales/index.js";
import { SearchFilters } from "../../types/ProductSearch.js";

export class SearchProductsRepo {
  constructor(private prisma: PrismaClient) {}

  async searchProducts(filters: SearchFilters, language: SupportedLang) {
    const whereConditions: any = this.buildWhereConditions(filters);

    return this.prisma.product.findMany({
      where: whereConditions,
      take: filters.limit,
      skip: filters.offset,
      orderBy: { createdAt: "desc" },
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
              select: { name: true, slug: true }, // translations for display
            },
            category: {
              select: {
                slug: true, // base slug for filtering
                categorytranslation: {
                  where: { language },
                  select: { name: true, slug: true }, // translations for display
                },
              },
            },
          },
        },
        listingType: {
          select: {
            slug: true, // base slug
            listing_type_translation: {
              where: { language },
              select: { name: true, slug: true },
            },
          },
        },
        attributes: {
          select: {
            id: true,
            attribute: {
              select: {
                code: true, // use code for filtering
                attributeTranslation: {
                  where: { language },
                  select: { name: true, slug: true }, // translations for display
                },
              },
            },
            attributeValue: {
              select: {
                value_code: true, // use code for filtering
                attributeValueTranslations: {
                  where: { language },
                  select: { name: true, slug: true },
                },
              },
            },
          },
        },
        user: { select: { username: true, first_name: true, last_name: true } },
        agency: { select: { agency_name: true, logo: true } },
      },
    });
  }

  async getProductsCount(filters: SearchFilters, language: SupportedLang): Promise<number> {
    const whereConditions: any = this.buildWhereConditions(filters);
    return this.prisma.product.count({ where: whereConditions });
  }

  private buildWhereConditions(filters: SearchFilters) {
    const whereConditions: any = {};

    // ✅ Filter by base category or subcategory slug
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

    // ✅ Filter by price
    if (filters.pricelow !== undefined || filters.pricehigh !== undefined) {
      whereConditions.price = {};
      if (filters.pricelow !== undefined) whereConditions.price.gte = filters.pricelow;
      if (filters.pricehigh !== undefined) whereConditions.price.lte = filters.pricehigh;
    }

    // ✅ Filter by city name
    if (filters.city) {
      whereConditions.city = { name: { equals: filters.city } };
    }

    // ✅ Filter by listing type (base slug)
    if (filters.listingtype) {
      whereConditions.listingType = { slug: filters.listingtype };
    }

    // ✅ Filter by attribute code/value_code
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
