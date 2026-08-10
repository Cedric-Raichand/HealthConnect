const errorHandler = (err, req, res, next) => {

  console.error(err.stack);


  // ==========================================
  // MONGOOSE INVALID OBJECT ID
  // ==========================================

  if (err.name === "CastError") {

    return res.status(400).json({
      message: `Invalid ${err.path} provided`,
    });

  }


  // ==========================================
  // MONGOOSE VALIDATION ERROR
  // ==========================================

  if (err.name === "ValidationError") {

    const errors = Object.values(err.errors).map(
      (error) => error.message
    );

    return res.status(400).json({
      message: "Validation failed",
      errors,
    });

  }


  // ==========================================
  // MONGOOSE DUPLICATE KEY
  // ==========================================

  if (err.code === 11000) {

    const field = Object.keys(err.keyPattern)[0];

    return res.status(400).json({
      message: `${field} already exists`,
    });

  }


  // ==========================================
  // MULTER FILE SIZE ERROR
  // ==========================================

  if (err.code === "LIMIT_FILE_SIZE") {

    return res.status(400).json({
      message: "File size cannot exceed 5MB",
    });

  }


  // ==========================================
  // MULTER TOO MANY FILES
  // ==========================================

  if (err.code === "LIMIT_UNEXPECTED_FILE") {

    return res.status(400).json({
      message: "Too many files uploaded",
    });

  }


  // ==========================================
  // DEFAULT SERVER ERROR
  // ==========================================

  const statusCode = res.statusCode >= 400
    ? res.statusCode
    : 500;


  res.status(statusCode).json({

    message:
      err.message || "Internal server error",

  });

};


module.exports = errorHandler;