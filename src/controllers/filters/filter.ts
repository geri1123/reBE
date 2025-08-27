import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { CategoryRepository } from "../../repositories/category/categoryRepository";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo";

import { 
  getCategoriesFromCache, 
  setCategoriesCache,
  getListingTypesFromCache,
  setListingTypesCache
} from "../../cache/filtersCache.ts";

const categoryRepository = new CategoryRepository(prisma);
const listingTypeRepo = new ListingTypeRepo(prisma);

export async function getFilters(req: Request, res: Response, next: NextFunction) {
  const lang = res.locals.lang;

  try {
    // --- Categories ---
    let categories = getCategoriesFromCache(lang);
    if (!categories) {
      categories = await categoryRepository.getAllCategories(lang);
      setCategoriesCache(lang, categories);
    }

    // --- Listing Types (forever cache) ---
    let listingTypes = getListingTypesFromCache(lang);
    if (!listingTypes) {
      listingTypes = await listingTypeRepo.getAllListingTypes(lang);
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



// import { getCategoriesFromCache, setCategoriesCache } from "../../cache/filtersCache.ts";

// import { Request, Response, NextFunction } from "express";
// import { prisma } from "../../config/prisma";
// import { CategoryRepository } from "../../repositories/category/categoryRepository";
// const categoryRepository = new CategoryRepository(prisma);
// export async function getAllCategories(req: Request, res: Response, next: NextFunction) {
//   const languageCode = res.locals.lang;

//   try {
//     // Check if cached
//     const cached = getCategoriesFromCache(languageCode);
//     if (cached) {
//       return res.status(200).json({ success: true, categories: cached });
//     }

//     // Fetch from DB
//     const categories = await categoryRepository.getAllCategories(languageCode);

//     // Save to cache
//     setCategoriesCache(languageCode, categories);

//     res.status(200).json({ success: true, categories });
//   } catch (error) {
//     return next(error);
//   }
// }


// import { Request, Response, NextFunction } from "express";
// import { prisma } from "../../config/prisma";
// import { CategoryRepository } from "../../repositories/category/categoryRepository";


// const categoryRepository = new CategoryRepository(prisma);

// export async function getAllCategories(req:Request, res:Response, next:NextFunction) {

//      const languageCode = res.locals.lang; 
//   try {
//     const categories = await categoryRepository.getAllCategories(languageCode);
//     res.status(200).json({ success: true, categories });
//   } catch (error) {
//     return next(error);
//   }
// }