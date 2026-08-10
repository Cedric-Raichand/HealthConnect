const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const validate = require("../middleware/validate");
const validateObjectId = require("../middleware/validateObjectId");

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
  validateObjectId("id", "appointment"),
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
  validateObjectId("id", "appointment"),
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
  validateObjectId("id", "appointment"),
  cancelAppointmentValidator,
  validate,
  cancelAppointment
);


module.exports = router;