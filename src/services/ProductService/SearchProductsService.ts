import { SupportedLang } from "../../locales/index.js";
import { SearchFilters } from "../../types/ProductSearch.js";
import { SearchProductsRepo } from "../../repositories/products/SearchProductRepo.js";
import { config } from "../../config/config.js";
import { ISearchProductRepo } from "../../repositories/products/ISearchProductRepo.js";
import { ProductWithRelations } from "../../types/ProductSearch.js";
import {getFirebaseImageUrl} from "../../utils/firebaseUpload/firebaseUtils.js"
export class SearchProductsService  {
  constructor(private repo: ISearchProductRepo) {}

  async getProducts(filters: SearchFilters, language: SupportedLang) {
    const products = await this.repo.searchProducts(filters, language);
    const totalCount = await this.repo.getProductsCount(filters, language);
    const productsFullImageurl = (products as ProductWithRelations[]).map(product => {
  const images = product.image.map(img => ({
    ...img,
    imageUrl:  getFirebaseImageUrl(img.imageUrl),
  }));
  return { ...product, image: images };
});
    return {
      products:productsFullImageurl,
      totalCount,
      currentPage: Math.floor(filters.offset! / filters.limit!) + 1,
      totalPages: Math.ceil(totalCount / filters.limit!),
    };
  }
}