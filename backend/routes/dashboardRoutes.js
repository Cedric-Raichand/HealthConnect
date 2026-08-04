const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboard,
} = require("../controllers/dashboardController");


// Logged-in users get dashboard data
router.get(
  "/",
  protect,
  getDashboard
);


module.exports = router;