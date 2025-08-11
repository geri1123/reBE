import { Request, Response, NextFunction } from "express";
import { prisma } from "../../config/prisma";
import { CategoryRepository } from "../../repositories/category/categoryRepository";
import { parseLanguageCode } from "../../utils/language";

const categoryRepository = new CategoryRepository(prisma);

export async function getAllCategories(req:Request, res:Response, next:NextFunction) {
  const languageCode = parseLanguageCode(req.params.language );

  try {
    const categories = await categoryRepository.getAllCategories(languageCode);
    res.status(200).json({ success: true, categories });
  } catch (error) {
    return next(error);
  }
}