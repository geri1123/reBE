import { PrismaClient, LanguageCode } from "@prisma/client";
import { IAttributeRepo } from "./IattributeRepo.js";

export class AttributeRepo implements IAttributeRepo {
  constructor(private prisma: PrismaClient) {}

  async getAttributesBySubcategoryId(
    subcategoryId: number,
    language: LanguageCode = LanguageCode.al
  ) {
    const attributes = await this.prisma.attribute.findMany({
      where: { subcategoryId },
      include: {
        attributeTranslation: {
          where: { language },
          select: { name: true, slug: true },
        },
        values: {
          include: {
            attributeValueTranslations: {
              where: { language },
              select: { name: true, slug: true },
            },
          },
        },
      },
    });

    return attributes.map(attr => ({
      id: attr.id,
      
      name: attr.attributeTranslation[0]?.name ?? "No translation",
      slug: attr.attributeTranslation[0]?.slug ?? null,
      values: attr.values.map(v => ({
        id: v.id,
        name: v.attributeValueTranslations[0]?.name ?? "No translation",
        slug: v.attributeValueTranslations[0]?.slug ?? null,
      })),
    }));
  }
}
