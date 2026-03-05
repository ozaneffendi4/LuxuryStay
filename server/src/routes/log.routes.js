import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/requireRole.middleware.js";
import { listLogs } from "../controllers/log.controller.js";

const router = Router();
router.use(authMiddleware, requireRoles("admin"));
router.get("/", listLogs);

export default router;