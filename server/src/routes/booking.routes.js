import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireMinRole, requireRoles } from "../middleware/requireRole.middleware.js";
import {
  approveBooking,
  cancelBooking,
  checkIn,
  checkOut,
  createBooking,
  listAllBookings,
  listMyBookings,
  searchAvailableRooms
} from "../controllers/booking.controller.js";

const router = Router();

const searchSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    checkIn: z.string().min(8),
    checkOut: z.string().min(8)
  })
});

const createSchema = z.object({
  body: z.object({
    roomId: z.string().min(1),
    checkIn: z.string().min(8),
    checkOut: z.string().min(8),
    note: z.string().optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const listAllSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({ status: z.string().optional() })
});

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

router.get("/search", validate(searchSchema), searchAvailableRooms);

router.use(authMiddleware);

router.post("/", requireRoles("guest", "admin"), validate(createSchema), createBooking);
router.get("/mine", requireRoles("guest"), listMyBookings);

// manager+ can manage reservations; staff needs to see all for check-in/out
router.get("/", requireMinRole("staff"), validate(listAllSchema), listAllBookings);

router.post("/:id/approve", requireMinRole("manager"), validate(idSchema), approveBooking);
router.post("/:id/cancel", requireMinRole("staff"), validate(idSchema), cancelBooking);

router.post("/:id/checkin", requireRoles("staff", "admin"), validate(idSchema), checkIn);
router.post("/:id/checkout", requireRoles("staff", "admin"), validate(idSchema), checkOut);

export default router;