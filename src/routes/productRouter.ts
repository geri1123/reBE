import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import { CreateProduct } from "../controllers/product/Create.js";
import { uploadMultipleGeneralImages } from "../middlewares/uploadFile.js";
import { GetProductsBySearch } from "../controllers/product/Get.js";
// import { getAvailableFilters } from "../controllers/product/Get.js";
import { multerErrorWrapper } from "../middlewares/multerError.js";
import { detectLanguage } from "../middlewares/langMiddleware.js";
import { uploadSingleDocument } from "../middlewares/uploadFile.js";
import { multerDocumentErrorWrapper } from "../middlewares/documentError.js";
const router=express.Router();

router.post(
  "/addProduct",
  verifyToken,           
 multerErrorWrapper(uploadMultipleGeneralImages),
//  multerDocumentErrorWrapper(uploadSingleDocument),
  CreateProduct            
);



router.get('/search', GetProductsBySearch);

// 2. Category only
router.get('/search/:category', GetProductsBySearch);

// 3. Category + subcategory
router.get('/search/:category/:subcategory',GetProductsBySearch);


export default router;