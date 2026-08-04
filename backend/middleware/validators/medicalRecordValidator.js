const { body } = require("express-validator");


// Create medical record validation
const createMedicalRecordValidator = [

  body("patientId")
    .notEmpty()
    .withMessage("Patient ID is required"),


  body("diagnosis")
    .trim()
    .notEmpty()
    .withMessage("Diagnosis is required"),


  body("symptoms")
    .trim()
    .notEmpty()
    .withMessage("Symptoms are required"),


  body("treatment")
    .trim()
    .notEmpty()
    .withMessage("Treatment is required"),

];


module.exports = {
  createMedicalRecordValidator,
};