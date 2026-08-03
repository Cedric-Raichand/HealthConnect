const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createAppointment,
  getAppointments,
} = require("../controllers/appointmentController");

router.get(
  "/",
  protect,
  getAppointments
);

router.post(
  "/",
  protect,
  createAppointment
);

module.exports = router;