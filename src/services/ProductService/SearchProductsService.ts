import { SupportedLang } from "../../locales/index.js";
import { SearchFilters } from "../../types/ProductSearch.js";
import { SearchProductsRepo } from "../../repositories/products/SearchProductRepo.js";
import { config } from "../../config/config.js";
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
// export class SearchProductsService {
//   constructor(private repo: ISearchProductRepo) {}

//   async getProducts(filters: SearchFilters, language: SupportedLang) {
//     const products = await this.repo.searchProducts(filters, language);
//     const totalCount = await this.repo.getProductsCount(filters, language);

//     const productsForFrontend = (products as any[]).map(product => {
//       const images = product.image.map((img: any) => ({
//         imageUrl: getFirebaseImageUrl(img.imageUrl), // vetëm URL
//       }));

//       return {
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         city: product.city?.name || "Unknown",
//         image: images,
//         categoryName: product.subcategory?.category?.categorytranslation?.[0]?.name || "No Category",
//         subcategoryName: product.subcategory?.subcategorytranslation?.[0]?.name || "No Subcategory",
//         listingTypeName: product.listingType?.listing_type_translation?.[0]?.name || "No Listing Type",
        
//         // user, agency, attributes, slug, value_code, etc. nuk janë përfshirë
//       };
//     });

//     return {
//       products: productsForFrontend,
//       totalCount,
//       currentPage: Math.floor(filters.offset! / filters.limit!) + 1,
//       totalPages: Math.ceil(totalCount / filters.limit!),
//     };
//   }
// }
// export class SearchProductsService  {
//   constructor(private repo: ISearchProductRepo) {}

//   async getProducts(filters: SearchFilters, language: SupportedLang) {
//     const products = await this.repo.searchProducts(filters, language);
//     const totalCount = await this.repo.getProductsCount(filters, language);

//     const productsForFrontend = (products as ProductWithRelations[]).map(p => {
//       const images = p.image.map(img => ({
//         ...img,
//         imageUrl: getFirebaseImageUrl(img.imageUrl),
//       }));

//       // Thjeshtsojmë names direkt
//       const categoryName = p.subcategory?.category?.categorytranslation?.[0]?.name || "No Category";
//       const subcategoryName = p.subcategory?.subcategorytranslation?.[0]?.name || "No Subcategory";
//       const listingTypeName = p.listingType?.listing_type_translation?.[0]?.name || "No Listing Type";

//       return {
//         ...p,
//         image: images,
//         categoryName,
//         subcategoryName,
//         listingTypeName,
//       };
//     });

//     return {
//       products: productsForFrontend,
//       totalCount,
//       currentPage: Math.floor(filters.offset! / filters.limit!) + 1,
//       totalPages: Math.ceil(totalCount / filters.limit!),
//     };
//   }
// }