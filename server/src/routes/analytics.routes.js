import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/requireRole.middleware.js";
import { adminOverview, revenueByMonth } from "../controllers/analytics.controller.js";

const router = Router();
router.use(authMiddleware, requireRoles("admin"));

router.get("/overview", adminOverview);
router.get("/revenue-monthly", revenueByMonth);

export default router;