const { body } = require("express-validator");


// Create medical record validation
const createMedicalRecordValidator = [
  body("patientId")
    .notEmpty()
    .withMessage("Patient ID is required")
    .isMongoId()
    .withMessage("Patient ID must be a valid MongoDB ID"),

  body("diagnosis")
    .notEmpty()
    .withMessage("Diagnosis is required")
    .trim()
    .isLength({ min: 2, max: 500 })
    .withMessage("Diagnosis must be between 2 and 500 characters"),

  body("symptoms")
    .notEmpty()
    .withMessage("Symptoms are required")
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage("Symptoms must be between 2 and 1000 characters"),

  body("treatment")
    .notEmpty()
    .withMessage("Treatment is required")
    .trim()
    .isLength({ min: 2, max: 1000 })
    .withMessage("Treatment must be between 2 and 1000 characters"),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Notes cannot exceed 2000 characters"),
];


module.exports = {
  createMedicalRecordValidator,
};