const bcrypt = require("bcrypt");
const User = require("../models/User");
const Event = require("../models/Event");

const defaultEvents = [
  { name: "Code Sprint", category: "technical", fee: 100, seats: 30, description: "A competitive programming challenge." },
  { name: "Web Design League", category: "technical", fee: 80, seats: 25, description: "Design and build a creative web experience." },
  { name: "Robo Race", category: "technical", fee: 150, seats: 20, description: "A robotics racing competition." },
  { name: "Tech Quiz", category: "technical", fee: 50, seats: 40, description: "Test your knowledge of technology." },
  { name: "Battle of Bands", category: "cultural", fee: 200, seats: 15, description: "A live college music competition." },
  { name: "Street Dance Duel", category: "cultural", fee: 120, seats: 20, description: "A high-energy dance competition." }
];

async function seedInitialData() {
  const eventCount = await Event.countDocuments();
  if (eventCount === 0) {
    await Event.insertMany(defaultEvents);
    console.log("Default TechFest events added to MongoDB.");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPassword && !adminPassword.startsWith("replace_")) {
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 12);
      await User.create({
        name: process.env.ADMIN_NAME || "TechFest Admin",
        email: adminEmail,
        password: passwordHash,
        role: "admin"
      });
      console.log(`Initial admin account created for ${adminEmail}.`);
    }
  }
}

module.exports = { seedInitialData };
