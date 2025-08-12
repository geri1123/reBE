import { PrismaClient, LanguageCode } from "@prisma/client";

export class AttributeRepo {
  constructor(private prisma: PrismaClient) {}

  async getAttributesBySubcategoryId(
    subcategoryId: number,
    language: LanguageCode = LanguageCode.al
  ) {
    return await this.prisma.attribute.findMany({
      where: { subcategoryId },
      include: {
        translations: {
          where: { language },
          select: {
            id: true,
            language: true,
            name: true,
          },
        },
        values: {
          include: {
            translations: {
              where: { language },
              select: {
                id: true,
                language: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }
}
