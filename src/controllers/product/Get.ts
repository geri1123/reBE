// controllers/products/SearchProductsController.ts
import { Request, Response, NextFunction } from "express";
import { SupportedLang } from "../../locales/index.js";
import { SearchFilters } from "../../types/ProductSearch.js";
import { SearchProductsService } from "../../services/ProductService/SearchProductsService.js";
import { SearchProductsRepo } from "../../repositories/products/SearchProductRepo.js";
import { prisma } from "../../config/prisma.js";

const searchProductsRepo = new SearchProductsRepo(prisma);
const searchProductsService = new SearchProductsService(searchProductsRepo);

export async function GetProductsBySearch(req: Request, res: Response, next: NextFunction) {
  try {
    const language: SupportedLang = res.locals.lang;
     const categorySlug = req.params.category || undefined;
    const subcategorySlug = req.params.subcategory || undefined;

    const {
  pricelow,
  pricehigh,
  city,
  listingtype,
  limit = 10,
  offset = 0,
  lang,
  ...attributeFilters
} = req.query;

    const filters: SearchFilters = {
      categorySlug,
      subcategorySlug,
      pricelow: pricelow ? parseFloat(pricelow as string) : undefined,
      pricehigh: pricehigh ? parseFloat(pricehigh as string) : undefined,
      city: city ? city as string : undefined,
      listingtype: listingtype ? listingtype as string : undefined,
      attributes: attributeFilters as Record<string, string>,
      limit: parseInt(limit as string),
      offset: parseInt(offset as string),
    };

    const result = await searchProductsService.getProducts(filters, language);

    res.status(200).json({
      success: true,
      data: {
        ...result,
        filters,
      },
    });
  } catch (error) {
    console.error("Search error:", error);
    next(error);
  }
}


// Helper function to get available filter options for a category/subcategory
export async function getAvailableFilters(req: Request, res: Response, next: NextFunction) {
  try {
    const language: SupportedLang = res.locals.lang;
    const { category: categorySlug, subcategory: subcategorySlug } = req.params;

    // Get subcategory ID based on slug
    let subcategoryId: number | undefined;
    
    if (subcategorySlug) {
      const subcategory = await prisma.subcategory.findFirst({
        where: {
          subcategorytranslation: {
            some: {
              slug: subcategorySlug,
              language: language
            }
          }
        }
      });
      subcategoryId = subcategory?.id;
    }

    // Get attributes for this subcategory
    const attributes = subcategoryId ? await prisma.attribute.findMany({
      where: { subcategoryId },
      include: {
        attributeTranslation: {
          where: { language }
        },
        values: {
          include: {
            attributeValueTranslations: {
              where: { language }
            }
          }
        }
      }
    }) : [];

    // Get price range
    const priceRange = await prisma.product.aggregate({
      _min: { price: true },
      _max: { price: true },
      where: subcategoryId ? { subcategoryId } : {}
    });

    // Get available cities
    const cities = await prisma.city.findMany({
      where: {
        products: {
          some: subcategoryId ? { subcategoryId } : {}
        }
      },
      include: {
        country: true
      }
    });

    // Get available listing types
    const listingTypes = await prisma.listing_type.findMany({
      where: {
        products: {
          some: subcategoryId ? { subcategoryId } : {}
        }
      },
      include: {
        listing_type_translation: {
          where: { language }
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        attributes,
        priceRange: {
          min: priceRange._min.price || 0,
          max: priceRange._max.price || 0
        },
        cities,
        listingTypes
      }
    });

  } catch (error) {
    console.error('Get filters error:', error);
    next(error);
  }
}