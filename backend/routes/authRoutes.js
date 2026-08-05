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




// Register user

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: patient
 *               phone:
 *                 type: string
 *                 example: 0240000000
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Validation error
 */
router.post(
  "/register",
  authLimiter,
  registerValidator,
  validate,
  registerUser
);





// Login user

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: john@gmail.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post(
  "/login",
  authLimiter,
  loginValidator,
  validate,
  loginUser
);



module.exports = router;