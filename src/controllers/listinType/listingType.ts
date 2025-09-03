import { Request , Response , NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo.js";

import { SupportedLang } from "../../locales/index.js";
const listingTypeRepo = new ListingTypeRepo(prisma);

export async function getAllListingTypes(req: Request, res: Response, next: NextFunction) {
 
  const languageCode : SupportedLang= res.locals.lang; 
  try {
    const listingTypes = await listingTypeRepo.getAllListingTypes(languageCode);
    res.status(200).json({ success: true, listingTypes });
  } catch (error) {
    return next(error);
  }
}