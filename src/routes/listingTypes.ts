import { Router } from "express";

import { getCountries } from "../controllers/city/cityController.js";
import { getCities } from "../controllers/city/cityController.js";
const router = Router();

router.get("/countries", getCountries);
router.get("/cities/:countryCode", getCities);
export default router;