import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import { CreateProduct } from "../controllers/product/Create.js";
import { uploadMultipleGeneralImages } from "../middlewares/uploadFile.js";

const router=express.Router();

router.post(
  "/addProduct",
  verifyToken,           
  uploadMultipleGeneralImages, 
  CreateProduct            
);

export default router;