import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma.js";
import { AttributeRepo } from "../../repositories/attributes/attributesRepo.js";
import { AttributeService } from "../../services/AttributeService/AttributeService.js";

import { SupportedLang } from "../../locales/index.js";
const attributeRepo = new AttributeRepo(prisma);
const attributeService = new AttributeService(attributeRepo);
export async function getAttributes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subcategoryId = Number(req.params.subcategoryId); 
    const language: SupportedLang = res.locals.lang;

    if (!subcategoryId || isNaN(subcategoryId)) {
      res.status(400).json({ success: false, error: "Invalid subcategory ID" });
      return;
    }

    const attributes = await attributeService.getAttributes(subcategoryId, language);

    res.status(200).json({ success: true, attributes });
  } catch (error) {
    next(error);
  }
}