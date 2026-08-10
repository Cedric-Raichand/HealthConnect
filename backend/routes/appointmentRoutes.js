const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const validate = require("../middleware/validate");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");

const {
  createAppointmentValidator,
  updateAppointmentValidator,
  cancelAppointmentValidator,
} = require("../middleware/validators/appointmentValidator");


// ==========================================
// CREATE APPOINTMENT
// Patient only
// ==========================================

router.post(
  "/",
  protect,
  authorizeRoles("patient"),
  createAppointmentValidator,
  validate,
  createAppointment
);


// ==========================================
// GET ALL APPOINTMENTS
// Patient, Doctor, Admin
// ==========================================

router.get(
  "/",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getAppointments
);


// ==========================================
// GET SINGLE APPOINTMENT
// Patient, Doctor, Admin
// ==========================================

router.get(
  "/:id",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  getAppointmentById
);


// ==========================================
// UPDATE APPOINTMENT STATUS
// Doctor, Admin
// ==========================================

router.patch(
  "/:id/status",
  protect,
  authorizeRoles("doctor", "admin"),
  updateAppointmentValidator,
  validate,
  updateAppointmentStatus
);


// ==========================================
// CANCEL APPOINTMENT
// Patient, Doctor, Admin
// ==========================================

router.patch(
  "/:id/cancel",
  protect,
  authorizeRoles("patient", "doctor", "admin"),
  cancelAppointmentValidator,
  validate,
  cancelAppointment
);


module.exports = router;