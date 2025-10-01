import { Router } from "express";
import { getFilters } from "../controllers/filters/filter.js";
import { getAttributes } from "../controllers/filters/attributes.js";

const router = Router();

router.get("/filter" ,getFilters );

router.get("/attributes/:subcategoryId", getAttributes);
export default router;

// router.get("/categories/:language" ,getAllCategories );
// router.get("/attributes/:language/:subcategoryId", getAttributes);