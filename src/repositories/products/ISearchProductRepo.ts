import { SearchFilters } from "../../types/ProductSearch.js";
import { SupportedLang } from "../../locales/index.js";
export interface ISearchProductRepo {


  searchProducts(filters: SearchFilters, language: SupportedLang):Promise<any>;

getProductsCount(filters: SearchFilters, language: SupportedLang): Promise<number> ;

}