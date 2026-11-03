const express = require("express");
const bcrypt = require("bcrypt");
const { body, validationResult } = require("express-validator");
const { rateLimit } = require("express-rate-limit");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth } = require("../middleware/auth");
const { issueCsrfToken, csrfProtection } = require("../middleware/csrf");
const { issueAuthCookie, clearAuthCookie, publicUser } = require("../utils/token");

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many login attempts. Please try again after 15 minutes." }
});

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
}

router.get("/csrf", issueCsrfToken);

router.post(
  "/register",
  csrfProtection,
  authLimiter,
  body("name").trim().isLength({ min: 2, max: 60 }).withMessage("Name must contain 2 to 60 characters."),
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password").isLength({ min: 8, max: 72 }).withMessage("Password must contain at least 8 characters."),
  checkValidation,
  asyncHandler(async (req, res) => {
    const name = req.body.name.trim();
    const email = req.body.email.toLowerCase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const password = await bcrypt.hash(req.body.password, 12);
    const user = await User.create({ name, email, password, role: "participant" });
    issueAuthCookie(res, user);
    res.status(201).json({ message: "Account created successfully.", user: publicUser(user) });
  })
);

router.post(
  "/login",
  csrfProtection,
  authLimiter,
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
  checkValidation,
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email.toLowerCase() }).select("+password");
    const passwordMatches = user && await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    issueAuthCookie(res, user);
    res.json({ message: "Login successful.", user: publicUser(user) });
  })
);

router.post("/logout", csrfProtection, (req, res) => {
  clearAuthCookie(res);
  res.json({ message: "Logged out successfully." });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
