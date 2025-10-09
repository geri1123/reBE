import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { CategoryRepository } from "../../repositories/category/categoryRepository.js";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo.js";

import { 
  getCategoriesFromCache, 
  setCategoriesCache,
  getListingTypesFromCache,
  setListingTypesCache
} from "../../cache/filtersCache.js";

const categoryRepository = new CategoryRepository(prisma);
const listingTypeRepo = new ListingTypeRepo(prisma);

export async function getFilters(req: Request, res: Response, next: NextFunction) {
  const lang = res.locals.lang;
const productsStatus="active";
  try {
    // --- Categories ---
    let categories = getCategoriesFromCache(lang);
    if (!categories) {
      categories = await categoryRepository.getAllCategories(lang , productsStatus);
      setCategoriesCache(lang, categories);
    }

    // --- Listing Types (forever cache) ---
    let listingTypes = getListingTypesFromCache(lang);
    if (!listingTypes) {
      listingTypes = await listingTypeRepo.getAllListingTypes(lang , productsStatus);
      setListingTypesCache(lang, listingTypes);
    }

    // Return both in response
    res.status(200).json({
      success: true,
      categories,
      listingTypes
    });
  } catch (error) {
    return next(error);
  }
}

