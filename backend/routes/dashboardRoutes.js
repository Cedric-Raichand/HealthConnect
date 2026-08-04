const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboard,
} = require("../controllers/dashboardController");


// Get dashboard statistics
router.get(
  "/",
  protect,
  getDashboard
);


module.exports = router;