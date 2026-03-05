import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/requireRole.middleware.js";
import { confirmPayment, initiatePayment } from "../controllers/payment.controller.js";

const router = Router();

router.use(authMiddleware);

const initSchema = z.object({
  body: z.object({ bookingId: z.string().min(1) }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const confirmSchema = z.object({
  body: z.object({ paymentId: z.string().min(1) }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

router.post("/initiate", requireRoles("guest", "admin"), validate(initSchema), initiatePayment);
router.post("/confirm", requireRoles("guest", "admin"), validate(confirmSchema), confirmPayment);

export default router;