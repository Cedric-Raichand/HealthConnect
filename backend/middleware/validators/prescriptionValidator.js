const { body } = require("express-validator");


// Create prescription validation
const createPrescriptionValidator = [

  body("patientId")
    .notEmpty()
    .withMessage("Patient ID is required"),


  body("medicalRecordId")
    .notEmpty()
    .withMessage("Medical record ID is required"),


  body("medicine")
    .trim()
    .notEmpty()
    .withMessage("Medicine is required"),


  body("dosage")
    .trim()
    .notEmpty()
    .withMessage("Dosage is required"),


  body("frequency")
    .trim()
    .notEmpty()
    .withMessage("Frequency is required"),


  body("duration")
    .trim()
    .notEmpty()
    .withMessage("Duration is required"),

];


module.exports = {
  createPrescriptionValidator,
};