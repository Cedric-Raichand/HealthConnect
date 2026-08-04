const { body } = require("express-validator");


// Create appointment validation
const createAppointmentValidator = [

  body("doctorId")
    .notEmpty()
    .withMessage("Doctor ID is required"),


  body("appointmentDate")
    .notEmpty()
    .withMessage("Appointment date is required")
    .isISO8601()
    .withMessage("Invalid appointment date format")
    .custom((value) => {

      if (new Date(value) <= new Date()) {
        throw new Error(
          "Appointment date must be in the future"
        );
      }

      return true;

    }),


  body("reason")
    .trim()
    .notEmpty()
    .withMessage("Reason is required"),

];


module.exports = {
  createAppointmentValidator,
};