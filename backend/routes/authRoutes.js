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


const router = express.Router();



router.post(
  "/register",
  registerValidator,
  validate,
  registerUser
);



router.post(
  "/login",
  loginValidator,
  validate,
  loginUser
);



module.exports = router;