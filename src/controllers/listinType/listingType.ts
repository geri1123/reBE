import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo.js";
import { SupportedLang } from "../../locales/index.js";

type Listing = {
  id: number;
  name: string;
};

const listingTypeRepo = new ListingTypeRepo(prisma);

export async function getAllListingTypes(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {  
  const languageCode: SupportedLang = res.locals.lang;

  try {
    const listingTypes: Listing[] = await listingTypeRepo.getAllListingTypes(languageCode);
    res.status(200).json({ success: true, listingTypes });
  } catch (error) {
    return next(error);
  }
}
