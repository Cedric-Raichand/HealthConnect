const rateLimit = require("express-rate-limit");


// General API limiter
const apiLimiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100, // limit each IP to 100 requests

  message: {
    message: "Too many requests, please try again later",
  },

});



// Authentication limiter
const authLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 10, // 10 login/register attempts

  message: {
    message: "Too many authentication attempts, try again later",
  },

});


module.exports = {
  apiLimiter,
  authLimiter,
};