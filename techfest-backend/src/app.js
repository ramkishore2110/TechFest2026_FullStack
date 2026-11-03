const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const { csrfProtection } = require("./middleware/csrf");
const { notFound, errorHandler } = require("./middleware/error");

const app = express();
const allowedOrigins = (process.env.CLIENT_URLS || "http://localhost:5173,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("This website is not allowed to access the API."));
  },
  credentials: true
}));
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(csrfProtection);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "TechFest API is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
