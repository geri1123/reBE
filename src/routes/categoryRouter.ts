import { Router } from "express";
import { getFilters } from "../controllers/filters/filter";
import { getAttributes } from "../controllers/filters/attributes";

const router = Router();

router.get("/filter" ,getFilters );
// router.get("/categories/:language" ,getAllCategories );
router.get("/attributes/:language/:subcategoryId", getAttributes);
router.get("/attributes/:subcategoryId", getAttributes);
export default router;