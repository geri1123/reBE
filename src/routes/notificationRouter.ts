import { Router } from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { getNotifications, markNotificationAsRead } from "../controllers/notifications/notifications";
const router= Router();

router.get('/getNotifications', verifyToken, getNotifications);
router.get('/getNotifications/:lang', verifyToken, getNotifications);
router.patch('/markAsRead/:id', verifyToken, markNotificationAsRead);
export default router;