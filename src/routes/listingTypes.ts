import { Router } from "express";
import { getAllListingTypes } from "../controllers/listinType/listingType";
const router = Router();
router.get('/listingTypes' , getAllListingTypes)
router.get("/listingTypes/:language" , getAllListingTypes)
export default router;