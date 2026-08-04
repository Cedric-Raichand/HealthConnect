const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  cancelAppointment,
} = require("../controllers/appointmentController");


// Get all appointments
router.get(
  "/",
  protect,
  getAppointments
);


// Book appointment
router.post(
  "/",
  protect,
  createAppointment
);


// Get single appointment
router.get(
  "/:id",
  protect,
  getAppointmentById
);


// Update appointment status
router.patch(
  "/:id/status",
  protect,
  updateAppointmentStatus
);


// Cancel appointment
router.patch(
  "/:id/cancel",
  protect,
  cancelAppointment
);


module.exports = router;