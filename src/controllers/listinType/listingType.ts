import { Request , Response , NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo";
import { parseLanguageCode } from "../../utils/language";

const listingTypeRepo = new ListingTypeRepo(prisma);

export async function getAllListingTypes(req: Request, res: Response, next: NextFunction) {
  const languageCode = parseLanguageCode(req.params.language);

  try {
    const listingTypes = await listingTypeRepo.getAllListingTypes(languageCode);
    res.status(200).json({ success: true, listingTypes });
  } catch (error) {
    return next(error);
  }
}