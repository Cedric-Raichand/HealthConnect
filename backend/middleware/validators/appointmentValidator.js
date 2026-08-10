const { body } = require("express-validator");


// Create appointment validation
const createAppointmentValidator = [
  body("doctorId")
    .notEmpty()
    .withMessage("Doctor ID is required")
    .isMongoId()
    .withMessage("Doctor ID must be a valid MongoDB ID"),

  body("appointmentDate")
    .notEmpty()
    .withMessage("Appointment date is required")
    .isISO8601()
    .withMessage("Appointment date must be a valid date")
    .custom((value) => {
      const appointmentDate = new Date(value);

      if (appointmentDate <= new Date()) {
        throw new Error("Appointment date must be in the future");
      }

      return true;
    }),

  body("reason")
    .notEmpty()
    .withMessage("Appointment reason is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Appointment reason must be at least 3 characters"),
];


// Update appointment status validation
const updateAppointmentValidator = [
  body("status")
    .notEmpty()
    .withMessage("Appointment status is required")
    .isIn([
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ])
    .withMessage("Invalid appointment status"),

  body("notes")
    .optional()
    .trim(),
];


// Cancel appointment validation
const cancelAppointmentValidator = [
  body("cancelReason")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Cancellation reason cannot exceed 500 characters"),
];


module.exports = {
  createAppointmentValidator,
  updateAppointmentValidator,
  cancelAppointmentValidator,
};