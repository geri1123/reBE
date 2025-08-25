import { Request , Response , NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo";

import { SupportedLang } from "../../locales/translations";
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