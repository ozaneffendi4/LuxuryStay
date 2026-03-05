import Log from "../models/Log.js";

export function notFound(req, res) {
  res.status(404).json({ message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const status = err.statusCode || 500;

  // fire-and-forget error log
  Log.create({
    actor: req.user?.id,
    action: "ERROR",
    level: "error",
    entityType: "server",
    entityId: "",
    meta: { message: err.message, stack: err.stack },
    ip: req.ip,
    userAgent: req.headers["user-agent"] || ""
  }).catch(() => {});

  res.status(status).json({
    message: status === 500 ? "Internal server error" : err.message
  });
}