import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import { CreateProduct } from "../controllers/product/Create.js";
import { uploadMultipleGeneralImages } from "../middlewares/uploadFile.js";
import { GetProductsBySearch } from "../controllers/product/Get.js";
import { getAvailableFilters } from "../controllers/product/Get.js";

const router=express.Router();

router.post(
  "/addProduct",
  verifyToken,           
  uploadMultipleGeneralImages, 
  CreateProduct            
);



router.get('/search', GetProductsBySearch);

// 2. Category only
router.get('/search/:category', GetProductsBySearch);

// 3. Category + subcategory
router.get('/search/:category/:subcategory', GetProductsBySearch);

// GET /filters/:category - Get available filters for category
// Example: /filters/property
// router.get('/filters/:category', getAvailableFilters);

// // GET /filters/:category/:subcategory - Get available filters for subcategory
// // Example: /filters/property/home
// router.get('/filters/:category/:subcategory', getAvailableFilters);
export default router;