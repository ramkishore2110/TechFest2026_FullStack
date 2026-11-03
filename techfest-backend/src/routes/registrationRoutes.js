const express = require("express");
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Event = require("../models/Event");
const Registration = require("../models/Registration");
const asyncHandler = require("../middleware/asyncHandler");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { isValidPhone } = require("../utils/validation");

const router = express.Router();

function checkValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg, errors: errors.array() });
  }
  next();
}

router.post(
  "/",
  requireAuth,
  body("eventId").isMongoId().withMessage("Choose a valid event."),
  body("phone").custom(isValidPhone).withMessage("Enter a valid 10-digit Indian mobile number."),
  checkValidation,
  asyncHandler(async (req, res) => {
    const eventId = req.body.eventId;
    const alreadyRegistered = await Registration.findOne({ user: req.user._id, event: eventId, status: "confirmed" });
    if (alreadyRegistered) {
      return res.status(409).json({ message: "You are already registered for this event." });
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, seats: { $gt: 0 } },
      { $inc: { seats: -1 } },
      { new: true }
    );
    if (!event) {
      const eventExists = await Event.exists({ _id: eventId });
      return res.status(eventExists ? 409 : 404).json({ message: eventExists ? "This event is sold out." : "Event not found." });
    }

    try {
      const registration = await Registration.create({
        user: req.user._id,
        event: eventId,
        phone: req.body.phone
      });
      await registration.populate("event", "name category fee date");
      res.status(201).json({ message: "Event registration successful.", registration });
    } catch (error) {
      await Event.updateOne({ _id: eventId }, { $inc: { seats: 1 } });
      if (error.code === 11000) {
        return res.status(409).json({ message: "You are already registered for this event." });
      }
      throw error;
    }
  })
);

router.get("/my", requireAuth, asyncHandler(async (req, res) => {
  const registrations = await Registration.find({ user: req.user._id })
    .populate("event", "name category fee date")
    .sort({ createdAt: -1 });
  res.json({ registrations });
}));

router.get("/", requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const registrations = await Registration.find()
    .populate("user", "name email")
    .populate("event", "name category fee")
    .sort({ createdAt: -1 });
  res.json({ registrations });
}));

router.delete("/:id", requireAuth, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: "Invalid registration ID." });
  }

  const registration = await Registration.findById(req.params.id);
  if (!registration) return res.status(404).json({ message: "Registration not found." });
  if (registration.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "You cannot cancel this registration." });
  }
  if (registration.status === "confirmed") {
    registration.status = "cancelled";
    await registration.save();
    await Event.updateOne({ _id: registration.event }, { $inc: { seats: 1 } });
  }
  res.json({ message: "Registration cancelled successfully." });
}));

module.exports = router;
