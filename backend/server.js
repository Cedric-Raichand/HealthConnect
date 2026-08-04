const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const medicalRecordRoutes = require("./routes/medicalRecordRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const userRoutes = require("./routes/userRoutes");

const connectDB = require("./config/db");


dotenv.config();

connectDB();


const app = express();


app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/users", userRoutes);


app.get("/", (req, res) => {
  res.send("HealthConnect API is running...");
});


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});