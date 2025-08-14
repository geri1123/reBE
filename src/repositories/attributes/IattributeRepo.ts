import {  LanguageCode } from "@prisma/client";

export interface IAttributeRepo {
  getAttributesBySubcategoryId(
    subcategoryId: number,
    language?: LanguageCode
  ): Promise<any>; 
}