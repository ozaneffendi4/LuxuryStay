import { verifyToken } from "../utils/token.js";
import User from "../models/User.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = verifyToken(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub).lean();
    if (!user || !user.isActive) return res.status(401).json({ message: "Unauthorized" });

    req.user = { id: user._id.toString(), role: user.role, email: user.email, name: user.name };
    next();
  } catch (e) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}