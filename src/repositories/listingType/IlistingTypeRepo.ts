
import { LanguageCode } from "@prisma/client";

export interface IListingTypeRepo {
  getAllListingTypes(
    language?: LanguageCode
  ): Promise<{ id: number; name: string }[]>;
}