import { Router } from "express";
import { getAllCategories } from "../controllers/categories/categories";
import { getAttributes } from "../controllers/categories/attributes";

const router = Router();

router.get("/categories" ,getAllCategories );
router.get("/categories/:language" ,getAllCategories );
router.get("/attributes/:language/:subcategoryId", getAttributes);
router.get("/attributes/:subcategoryId", getAttributes);
export default router;