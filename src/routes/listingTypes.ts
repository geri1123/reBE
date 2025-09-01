import { Router } from "express";
import { getAllListingTypes } from "../controllers/listinType/listingType.js";
const router = Router();
// router.get('/listingTypes' , getAllListingTypes)
router.get("/listingTypes" , getAllListingTypes)
export default router;