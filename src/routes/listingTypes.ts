import { Router } from "express";
import { getAllListingTypes } from "../controllers/listinType/listingType.js";
import { getCountries } from "../controllers/city/cityController.js";
import { getCities } from "../controllers/city/cityController.js";
const router = Router();
// router.get('/listingTypes' , getAllListingTypes)
router.get("/listingTypes" , getAllListingTypes)
router.get("/countries", getCountries);
router.get("/cities/:countryCode", getCities);
export default router;