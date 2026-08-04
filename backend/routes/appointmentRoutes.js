const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const validate = require("../middleware/validate");

const {
  createAppointment,
  getAppointments,
} = require("../controllers/appointmentController");


const {
  createAppointmentValidator,
} = require("../middleware/validators/appointmentValidator");



// Patient books appointment
router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createAppointmentValidator,
  validate,
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