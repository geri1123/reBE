import { LanguageCode, PrismaClient ,productsStatus} from "@prisma/client";
import { IListingTypeRepo } from "./IlistingTypeRepo.js";

export class ListingTypeRepo implements IListingTypeRepo {
    constructor(private prisma: PrismaClient) {}

    async getAllListingTypes(
        language: LanguageCode = LanguageCode.al, status:productsStatus
    ): Promise<{ id: number; name: string; slug: string | null; productCount: number; }[]> {
        const listingTypes = await this.prisma.listing_type.findMany({
            select: {
                id: true,
                listing_type_translation: {
                    where: { language },
                    select: { name: true, slug: true },
                },
                _count: {
                select: {
                products: {
                 
                  where: status ? { status } : undefined,
                },
              },
                }
            },
        });

        return listingTypes.map((lt) => ({
            id: lt.id,
            name: lt.listing_type_translation[0]?.name ?? "",
            slug: lt.listing_type_translation[0]?.slug ?? null,
            productCount: lt._count.products  
        }));
    }
}