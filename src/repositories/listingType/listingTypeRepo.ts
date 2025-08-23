import { LanguageCode, PrismaClient } from "@prisma/client";
import { IListingTypeRepo } from "./IlistingTypeRepo";
export class ListingTypeRepo implements IListingTypeRepo {
    constructor(private prisma: PrismaClient) {}

    async getAllListingTypes(
        language: LanguageCode = LanguageCode.al
    ): Promise<{ id: number; name: string }[]> {
        const listingTypes = await this.prisma.listing_type.findMany({
            select: {
                id: true,
                listing_type_translation: {
                    where: { language },
                    select: { name: true , slug:true },
                },
            },
        });

        
        return listingTypes.map((lt) => ({
            id: lt.id,
            name: lt.listing_type_translation[0]?.name ?? "",
            slug:lt.listing_type_translation[0]?.slug ?? null,
        }));
    }
}
