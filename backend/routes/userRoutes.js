const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const {
  getProfile,
  updateProfile,
  getDoctors,
  getAllUsers,
  getUserById,
  updateUserVerification,
  deleteUser,
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


// ==========================================
// GET SINGLE USER
// Admin only
// ==========================================

router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getUserById
);


// ==========================================
// VERIFY / UNVERIFY USER
// Admin only
// ==========================================

router.patch(
  "/:id/verification",
  protect,
  authorizeRoles("admin"),
  updateUserVerification
);


// ==========================================
// DELETE USER
// Admin only
// ==========================================

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  deleteUser
);


module.exports = router;