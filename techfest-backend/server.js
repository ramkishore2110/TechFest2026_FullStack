require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const { seedInitialData } = require("./src/config/seed");

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Set JWT_SECRET in your .env file to a random value with at least 32 characters.");
  }

  await connectDB();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`TechFest backend running at http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((error) => {
  console.error("Could not start the TechFest backend:", error.message);
  process.exit(1);
});
