import { IAttributeRepo } from "../../repositories/attributes/IattributeRepo";
import { LanguageCode } from "@prisma/client";

export class AttributeService {
  constructor(private attributeRepo: IAttributeRepo) {}

  async getAttributes(subcategoryId: number, language: LanguageCode = LanguageCode.al) {
    return await this.attributeRepo.getAttributesBySubcategoryId(subcategoryId, language);
  }
}