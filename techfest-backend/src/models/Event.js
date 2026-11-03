const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  category: { type: String, required: true, enum: ["technical", "cultural"] },
  fee: { type: Number, required: true, min: 0 },
  seats: { type: Number, required: true, min: 0, default: 0 },
  date: { type: Date },
  description: { type: String, trim: true, maxlength: 500, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
