const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  createAppointment,
  getAppointments,
} = require("../controllers/appointmentController");


// Patient books appointment
router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createAppointment
);


// Patient, Doctor, Admin view appointments
router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getAppointments
);


module.exports = router;