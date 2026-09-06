const { body } = require("express-validator");

// ==========================================
// CREATE PRESCRIPTION VALIDATION
// ==========================================

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
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Medicine must be between 2 and 200 characters"),

  body("dosage")
    .notEmpty()
    .withMessage("Dosage is required")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Dosage must be between 1 and 200 characters"),

  body("frequency")
    .notEmpty()
    .withMessage("Frequency is required")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Frequency must be between 1 and 200 characters"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Duration must be between 1 and 200 characters"),

  body("instructions")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Instructions cannot exceed 1000 characters"),
];

module.exports = {
  createPrescriptionValidator,
};
