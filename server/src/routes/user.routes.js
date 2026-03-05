import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/requireRole.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createUser, deleteUser, listUsers, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.use(authMiddleware, requireRoles("admin"));

const createSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["admin", "manager", "staff", "guest"])
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional()
});

const updateSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    role: z.enum(["admin", "manager", "staff", "guest"]).optional(),
    isActive: z.boolean().optional()
  }),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

const idSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().min(1) }),
  query: z.object({}).optional()
});

router.get("/", listUsers);
router.post("/", validate(createSchema), createUser);
router.put("/:id", validate(updateSchema), updateUser);
router.delete("/:id", validate(idSchema), deleteUser);

export default router;