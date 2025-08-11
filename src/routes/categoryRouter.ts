import { Router } from "express";
import { getAllCategories } from "../controllers/categories/categories";


const router = Router();

router.get("/categories" ,getAllCategories );
router.get("/categories/:language" ,getAllCategories );


export default router;