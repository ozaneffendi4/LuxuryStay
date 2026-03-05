const ROLE_ORDER = ["guest", "staff", "manager", "admin"];

function hasAtLeastRole(userRole, minRole) {
  return ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(minRole);
}

// require exact role(s) OR minimum role
export function requireRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}

export function requireMinRole(minRole) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!hasAtLeastRole(req.user.role, minRole)) return res.status(403).json({ message: "Forbidden" });
    next();
  };
}