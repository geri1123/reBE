import express from "express";
import { verifyToken } from "../middlewares/verifyToken.js";

import { CreateProduct } from "../controllers/product/Create.js";


const router=express.Router();

router.post("/addProduct" , verifyToken ,CreateProduct );

export default router;