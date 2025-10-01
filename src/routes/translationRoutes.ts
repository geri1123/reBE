import { Router } from "express";
import { translateUrl } from "../controllers/translation/translationController.js";

const router = Router();

router.post("/translate-url", translateUrl);

export default router;