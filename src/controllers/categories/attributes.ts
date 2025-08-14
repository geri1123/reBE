import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { AttributeRepo } from "../../repositories/attributes/attributesRepo";
import { AttributeService } from "../../services/AttributeService/AttributeService";
import { LanguageCode } from "@prisma/client";

const attributeRepo = new AttributeRepo(prisma);
const attributeService = new AttributeService(attributeRepo);

export async function getAttributes(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const subcategoryId = Number(req.params.subcategoryId); 
     const language = req.params.language as LanguageCode; 

    if (!subcategoryId || isNaN(subcategoryId)) {
       res.status(400).json({ error: "Invalid subcategory ID" });
       return
    }

    const attributes = await attributeService.getAttributes(subcategoryId, language);
    res.json(attributes);
  } catch (error) {
    next(error);
  }
}