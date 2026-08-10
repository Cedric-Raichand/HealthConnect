const { body } = require("express-validator");


// ==========================================
// REGISTER VALIDATION
// ==========================================

const registerValidator = [

  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),


  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),


  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6, max: 100 })
    .withMessage("Password must be between 6 and 100 characters"),


  body("role")
    .optional()
    .isIn(["patient", "doctor", "admin"])
    .withMessage("Invalid user role"),


  body("phone")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Phone number cannot exceed 20 characters"),

];



// ==========================================
// LOGIN VALIDATION
// ==========================================

const loginValidator = [

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),


  body("password")
    .notEmpty()
    .withMessage("Password is required"),

];



module.exports = {
  registerValidator,
  loginValidator,
};