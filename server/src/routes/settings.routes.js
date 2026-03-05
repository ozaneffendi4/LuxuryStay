import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/requireRole.middleware.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

const router = Router();

router.get("/", getSettings);

const updateSchema = z.object({
  body: z.object({
    taxPercent: z.number().min(0).max(100).optional(),
    discountPercent: z.number().min(0).max(100).optional(),
    hotelPolicies: z.string().optional(),
    currency: z.string().min(1).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

router.put("/", authMiddleware, requireRoles("admin"), validate(updateSchema), updateSettings);

export default router;