const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getProfile,
  updateProfile,
  getDoctors,
  getAllUsers,
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


// ==========================================
// GET ALL DOCTORS
// ==========================================

router.get(
  "/doctors",
  protect,
  getDoctors
);


// ==========================================
// GET ALL USERS
// Admin only
// ==========================================

router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getAllUsers
);


module.exports = router;