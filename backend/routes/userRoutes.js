const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");


// ==========================================
// GET LOGGED-IN USER PROFILE
// ==========================================

router.get(
  "/profile",
  protect,
  getProfile
);


// ==========================================
// UPDATE LOGGED-IN USER PROFILE
// ==========================================

router.put(
  "/profile",
  protect,
  updateProfile
);


module.exports = router;