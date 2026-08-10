const { body } = require("express-validator");


// Create prescription validation
const createPrescriptionValidator = [
  body("patientId")
    .notEmpty()
    .withMessage("Patient ID is required")
    .isMongoId()
    .withMessage("Patient ID must be a valid MongoDB ID"),

  body("medicalRecordId")
    .notEmpty()
    .withMessage("Medical record ID is required")
    .isMongoId()
    .withMessage("Medical record ID must be a valid MongoDB ID"),

  body("medicine")
    .notEmpty()
    .withMessage("Medicine is required")
    .trim(),

  body("dosage")
    .notEmpty()
    .withMessage("Dosage is required")
    .trim(),

  body("frequency")
    .notEmpty()
    .withMessage("Frequency is required")
    .trim(),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .trim(),

  body("instructions")
    .optional()
    .trim(),
];


module.exports = {
  createPrescriptionValidator,
};