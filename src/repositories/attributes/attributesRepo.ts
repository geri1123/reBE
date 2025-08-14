import { PrismaClient, LanguageCode } from "@prisma/client";
import { IAttributeRepo } from "./IattributeRepo";
export class AttributeRepo implements IAttributeRepo {
  constructor(private prisma: PrismaClient) {}
async getAttributesBySubcategoryId(
  subcategoryId: number,
  language: LanguageCode = LanguageCode.al
) {
  const attributes = await this.prisma.attribute.findMany({
    where: { subcategoryId },
    include: {
      translations: {
        where: { language },
        select: { name: true },
      },
      values: {
        include: {
          translations: {
            where: { language },
            select: { name: true },
          },
        },
      },
    },
  });

  return attributes.map(attr => ({
    id: attr.id,
    name: attr.translations[0]?.name ?? "No translation",
    values: attr.values.map(v => v.translations[0]?.name ?? "No translation"),
  }));
}
}
