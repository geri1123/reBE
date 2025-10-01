import { SupportedLang } from "../../locales/index.js";
import { SearchFilters } from "../../types/ProductSearch.js";
import { ISearchProductRepo } from "../../repositories/products/ISearchProductRepo.js";
import { ProductWithRelations } from "../../types/ProductSearch.js";
import {getFirebaseImageUrl} from "../../utils/firebaseUpload/firebaseUtils.js"

import { ProductFrontend } from "../../types/ProductSearch.js";

export class SearchProductsService {
  constructor(private repo: ISearchProductRepo) {}

  async getProducts(filters: SearchFilters, language: SupportedLang) {
    const products: ProductWithRelations[] = await this.repo.searchProducts(filters, language);
    const totalCount = await this.repo.getProductsCount(filters, language);

    const productsForFrontend: ProductFrontend[] = products.map((product: ProductWithRelations) => {
      const images = product.image.map((img: { imageUrl: string | null }) => ({
        imageUrl: img.imageUrl ? getFirebaseImageUrl(img.imageUrl) : null,
      }));

     return {
    id: product.id,
    title: product.title,
    price: product.price,
    city: product.city?.name || "Unknown",
    createdAt: product.createdAt,
    image: images,
    categoryName: product.subcategory?.category?.categorytranslation?.[0]?.name || "No Category",
    subcategoryName: product.subcategory?.subcategorytranslation?.[0]?.name || "No Subcategory",
    listingTypeName: product.listingType?.listing_type_translation?.[0]?.name || "No Listing Type",
    agency: product.agency
      ? {
          agency_name: product.agency.agency_name || "Unknown Agency",
          logo: product.agency.logo ? getFirebaseImageUrl(product.agency.logo) : null,
        }
      : null,
  };
    });

    return {
      products: productsForFrontend,
      totalCount,
      currentPage: Math.floor(filters.offset! / filters.limit!) + 1,
      totalPages: Math.ceil(totalCount / filters.limit!),
    };
  }
}
