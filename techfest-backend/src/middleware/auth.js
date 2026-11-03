const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

const requireAuth = asyncHandler(async (req, res, next) => {
  const bearerToken = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = req.cookies?.tf_auth || bearerToken;

  if (!token) {
    return res.status(401).json({ message: "Please log in to continue." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(401).json({ message: "Your login has expired. Please log in again." });
  }

  const user = await User.findById(payload.sub).select("name email role");
  if (!user) {
    return res.status(401).json({ message: "User account not found." });
  }

  req.user = user;
  next();
});

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Administrator access is required." });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
