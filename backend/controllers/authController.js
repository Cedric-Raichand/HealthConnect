const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");


// Register
const registerUser = async (req, res, next) => {

  try {

    const {
      fullName,
      email,
      password,
      role,
      phone,
    } = req.body;


    if (
      !fullName ||
      !email ||
      !password
    ) {

      return res.status(400).json({
        message: "Please fill all required fields",
      });

    }


    const userExists = await User.findOne({
      email,
    });


    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }


    const salt = await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(password, salt);


    const user = await User.create({

      fullName,

      email,

      password: hashedPassword,

      role: role || "patient",

      phone,

    });


    res.status(201).json({

      message: "Registration successful",

      token: generateToken(user._id),

      user: {

        id: user._id,

        fullName: user.fullName,

        email: user.email,

        role: user.role,

      },

    });


  } catch (error) {

    next(error);

  }

};




// Login
const loginUser = async (req, res, next) => {

  try {

    const {
      email,
      password,
    } = req.body;


    const user = await User.findOne({
      email,
    });


    if (
      user &&
      await bcrypt.compare(password, user.password)
    ) {

      return res.json({

        token: generateToken(user._id),

        user: {

          id: user._id,

          fullName: user.fullName,

          email: user.email,

          role: user.role,

        },

      });

    }


    res.status(401).json({
      message: "Invalid email or password",
    });


  } catch (error) {

    next(error);

  }

};


module.exports = {
  registerUser,
  loginUser,
};