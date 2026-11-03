const express = require("express");
const { body, validationResult } = require("express-validator");
const Event = require("../models/Event");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
}

const eventValidation = [
  body("name").trim().isLength({ min: 2, max: 100 }).withMessage("Event name must contain 2 to 100 characters."),
  body("category").isIn(["technical", "cultural"]).withMessage("Category must be technical or cultural."),
  body("fee").isFloat({ min: 0 }).withMessage("Fee must be zero or more."),
  body("seats").isInt({ min: 0 }).withMessage("Seats must be zero or more."),
  body("description").optional().trim().isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters."),
  checkValidation
];

router.get("/", asyncHandler(async (req, res) => {
  const events = await Event.find().sort({ createdAt: 1 });
  res.json({ events });
}));

router.get("/:id", asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found." });
  res.json({ event });
}));

router.post("/", requireAuth, requireAdmin, eventValidation, asyncHandler(async (req, res) => {
  const event = await Event.create({
    name: req.body.name,
    category: req.body.category,
    fee: Number(req.body.fee),
    seats: Number(req.body.seats),
    date: req.body.date || undefined,
    description: req.body.description || ""
  });
  res.status(201).json({ message: "Event created successfully.", event });
}));

router.put("/:id", requireAuth, requireAdmin, eventValidation, asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      category: req.body.category,
      fee: Number(req.body.fee),
      seats: Number(req.body.seats),
      date: req.body.date || undefined,
      description: req.body.description || ""
    },
    { new: true, runValidators: true }
  );
  if (!event) return res.status(404).json({ message: "Event not found." });
  res.json({ message: "Event updated successfully.", event });
}));

router.delete("/:id", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const event = await Event.findByIdAndDelete(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found." });
  res.json({ message: "Event deleted successfully." });
}));

module.exports = router;
