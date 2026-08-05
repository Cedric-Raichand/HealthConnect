const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");


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



// Security middleware

app.use(helmet());


app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);



app.use(express.json());


app.use(apiLimiter);



// Swagger Documentation

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);



// Routes

app.use("/api/auth", authRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/medical-records", medicalRecordRoutes);

app.use("/api/prescriptions", prescriptionRoutes);

app.use("/api/users", userRoutes);

app.use("/api/dashboard", dashboardRoutes);





// Health check route

app.get("/", (req, res) => {

  res.send("HealthConnect API is running...");

});




// Global error handler

app.use(errorHandler);




const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`);

});