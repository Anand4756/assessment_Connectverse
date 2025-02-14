const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `windowMs`
  message: { message: "Too many login attempts, please try again later." },
  headers: true, // Include rate limit headers in response
});

const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Limit each IP to 3 signup requests per hour
  message: { message: "Too many signup attempts, please try again later." },
});

module.exports = { loginLimiter, signupLimiter };
