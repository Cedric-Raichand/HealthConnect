const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");


// Get logged-in user profile
router.get(
  "/profile",
  protect,
  getProfile
);


// Update logged-in user profile
router.put(
  "/profile",
  protect,
  updateProfile
);


module.exports = router;