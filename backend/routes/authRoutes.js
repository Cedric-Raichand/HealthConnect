const express = require("express");

const {
  registerUser,
  loginUser,
} = require("../controllers/authController");

const validate = require("../middleware/validate");

const {
  registerValidator,
  loginValidator,
} = require("../middleware/validators/authValidator");

const {
  authLimiter,
} = require("../middleware/rateLimiter");


const router = express.Router();


// Register
router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  registerUser
);


// Login
router.post(
  "/login",
  authLimiter,
  loginValidator,
  validate,
  loginUser
);


module.exports = router;