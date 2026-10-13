const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const errorHandler = require("./middleware/errorMiddleware");

const {
  apiLimiter,
} = require("./middleware/rateLimiter");

const {
  swaggerUi,
  swaggerSpec,
} = require("./config/swagger");

const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// Behind Render/Railway/Vercel the real client IP arrives via a proxy header.
// Without this every user shares one IP and hits the rate limiter together.
app.set("trust proxy", 1);

// ===============================
// Security Middleware
// ===============================

app.use(helmet());

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(compression());

app.use(
  cors({
    origin(origin, cb) {
      // allow same-origin / tools (no Origin header) and listed origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());

app.use(apiLimiter);

// ===============================
// Swagger Documentation
// ===============================

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// ===============================
// API Routes
// ===============================

app.use("/api/auth", authRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/medical-records", medicalRecordRoutes);

app.use("/api/prescriptions", prescriptionRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);

// ===============================
// Health Check
// ===============================

app.get("/", (req, res) => {
  res.send("HealthConnect API is running...");
});

// ===============================
// Global Error Handler
// ===============================

app.use(errorHandler);

// ===============================
// Start Server
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});