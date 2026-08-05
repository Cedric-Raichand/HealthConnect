const errorHandler = (err, req, res, next) => {

  console.error(err.stack);



  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  let message = err.message;



  // MongoDB duplicate key error
  if (err.code === 11000) {

    statusCode = 400;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;

  }



  // Invalid MongoDB ObjectId
  if (err.name === "CastError") {

    statusCode = 400;

    message = "Invalid resource ID";

  }



  // JWT invalid token
  if (err.name === "JsonWebTokenError") {

    statusCode = 401;

    message = "Invalid token";

  }



  // JWT expired token
  if (err.name === "TokenExpiredError") {

    statusCode = 401;

    message = "Token expired, please login again";

  }



  res.status(statusCode).json({

    success: false,

    message,

    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),

  });

};



module.exports = errorHandler;