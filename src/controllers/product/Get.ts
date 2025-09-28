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
    const language: SupportedLang = res.locals.lang || "al";

    // These might be undefined for /products route
    const categorySlug = req.params.category || undefined;
    const subcategorySlug = req.params.subcategory || undefined;
   const {
  pricelow,
  pricehigh,
  areaLow,
  areaHigh,
  city,
  listingtype,
  sortBy,
  page = "1",
  lang,
  ...attributeFilters
} = req.query; 
    // const {
    //   pricelow,
    //   pricehigh,
    //   city,
    //   listingtype,
    //   sortBy,
    //   page = "1",
    //   lang,
    //   ...attributeFilters
    // } = req.query;

    
    const FIXED_LIMIT = 12;

    // Parse page and calculate offset
    const pageValue = Math.max(1, parseInt(page as string, 10) || 1);
    const offsetValue = (pageValue - 1) * FIXED_LIMIT;

    // console.log("🎯 Controller Debug:", {
    //   categorySlug,
    //   subcategorySlug,
    //   page: pageValue,
    //   limit: FIXED_LIMIT,
    //   offset: offsetValue,
    //   queryParams: req.query
    // });

    // const filters: SearchFilters = {
    //   categorySlug,
    //   subcategorySlug,
    //   pricelow: pricelow ? parseFloat(pricelow as string) : undefined,
    //   pricehigh: pricehigh ? parseFloat(pricehigh as string) : undefined,
    //   city: city ? (city as string) : undefined,
    //   listingtype: listingtype ? (listingtype as string) : undefined,
    //   attributes: attributeFilters as Record<string, string>,
    //   sortBy: sortBy ? (sortBy as 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc') : undefined,
    //   limit: FIXED_LIMIT,   
    //   offset: offsetValue,
    // };
const filters: SearchFilters = {
  categorySlug,
  subcategorySlug,
  pricelow: pricelow ? parseFloat(pricelow as string) : undefined,
  pricehigh: pricehigh ? parseFloat(pricehigh as string) : undefined,
  areaLow: areaLow ? parseFloat(areaLow as string) : undefined,   
  areaHigh: areaHigh ? parseFloat(areaHigh as string) : undefined,
  city: city ? (city as string) : undefined,
  listingtype: listingtype ? (listingtype as string) : undefined,
  attributes: attributeFilters as Record<string, string>,
  sortBy: sortBy ? (sortBy as 'price_asc' | 'price_desc' | 'date_asc' | 'date_desc') : undefined,
  limit: FIXED_LIMIT,
  offset: offsetValue,
};
    console.log("🔍 Controller filters:", filters);

    const result = await searchProductsService.getProducts(filters, language);

    console.log("✅ Controller result:", {
      productsCount: result.products.length,
      totalCount: result.totalCount,
      currentPage: result.currentPage,
      totalPages: result.totalPages
    });

    res.status(200).json({
      success: true,
      data: {
        ...result,
        filters: {
          ...filters,
          parsedPage: pageValue,
          calculatedOffset: offsetValue
        },
      },
    });
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search products",
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
}
