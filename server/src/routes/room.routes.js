import { Router } from "express";
import { z } from "zod";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/requireRole.middleware.js";
import {
  createRoom,
  deleteRoom,
  getRoom,
  listRooms,
  updateRoom,
  updateRoomChecklist
} from "../controllers/room.controller.js";

const router = Router();

const listSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z.enum(["available", "occupied", "maintenance"]).optional(),
    q: z.string().optional()
  })
});

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

const roomCreateSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    category: z.string().min(2),
    description: z.string().optional(),
    pricePerNight: z.coerce.number().min(0),
    images: z.array(z.string().min(3)).optional(),
    status: z.enum(["available", "occupied", "maintenance"]).optional(),
    capacity: z.coerce.number().min(1).optional(),
    amenities: z.array(z.string()).optional()
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const roomUpdateSchema = roomCreateSchema.extend({
  params: z.object({ id: z.string().min(1) })
});

// ✅ new checklist schema
const checklistSchema = z.object({
  body: z.object({
    cleaningDone: z.boolean(),
    wifiChecked: z.boolean(),
    acChecked: z.boolean(),
    bathroomSuppliesReady: z.boolean(),
    minibarStocked: z.boolean(),
    notes: z.string().optional()
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

router.get("/", validate(listSchema), listRooms);
router.get("/:id", validate(idSchema), getRoom);

router.post("/", authMiddleware, requireRoles("admin"), validate(roomCreateSchema), createRoom);
router.put("/:id", authMiddleware, requireRoles("admin"), validate(roomUpdateSchema), updateRoom);
router.delete("/:id", authMiddleware, requireRoles("admin"), validate(idSchema), deleteRoom);

// ✅ staff/admin can update checklist
router.put(
  "/:id/checklist",
  authMiddleware,
  requireRoles("staff", "admin"),
  validate(checklistSchema),
  updateRoomChecklist
);

export default router;