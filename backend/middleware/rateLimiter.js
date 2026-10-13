const rateLimit = require("express-rate-limit");


// General API limiter
const apiLimiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 1000, // a single page load fires several requests; 100 was too tight

  message: {
    message: "Too many requests, please try again later",
  },

});



// Authentication limiter
const authLimiter = rateLimit({

  windowMs: 15 * 60 * 1000,

  max: 20, // failed login/register attempts
  skipSuccessfulRequests: true, // only count failures

  message: {
    message: "Too many authentication attempts, try again later",
  },

});


module.exports = {
  apiLimiter,
  authLimiter,
};