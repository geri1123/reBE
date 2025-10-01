import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { CategoryRepository } from "../../repositories/category/categoryRepository.js";
import { ListingTypeRepo } from "../../repositories/listingType/listingTypeRepo.js";
import { AttributeRepo } from "../../repositories/attributes/attributesRepo.js";
import { TranslationService } from "../../services/TranslationService/TranslationService.js";
import { SupportedLang } from "../../locales/index.js";

const categoryRepository = new CategoryRepository(prisma);
const listingTypeRepo = new ListingTypeRepo(prisma);
const attributeRepo = new AttributeRepo(prisma);
const translationService = new TranslationService(categoryRepository, listingTypeRepo, attributeRepo);

interface TranslateUrlRequest {
  pathname: string;
  searchParams: Record<string, string>;
  sourceLang: SupportedLang;
  targetLang: SupportedLang;
}

export async function translateUrl(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { pathname, searchParams, sourceLang, targetLang } = req.body as TranslateUrlRequest;

    // Validate required fields
    if (!pathname || !sourceLang || !targetLang) {
      res.status(400).json({
        success: false,
        error: "Missing required fields: pathname, sourceLang, targetLang",
      });
      return;
    }

    const translatedUrl = await translationService.translateUrl({
      pathname,
      searchParams: searchParams || {},
      sourceLang,
      targetLang,
    });

    res.status(200).json({
      success: true,
      url: translatedUrl,
    });
  } catch (error) {
    console.error("Translation error:", error);
    next(error);
  }
}
