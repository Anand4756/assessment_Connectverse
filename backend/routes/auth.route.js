const express = require("express");
const authentication = require("../controllers/auth.controller");
const router = express.Router();
const auth = require("../middlewares/isAuthenticated");
const { loginLimiter, signupLimiter } = require("../middlewares/rateLimiter");

router.post("/login", loginLimiter, authentication.logincontroller);
router.post("/signup", signupLimiter, authentication.signup);
router.post("/verify-email", authentication.verifyEmail);

router.post("/forgot-password", authentication.forgotPassword);

router.post("/reset-password", authentication.updatepassword);

router.get("/userdetail", auth.isAuthenticated, authentication.userdetail);
router.post("/refreshtoken", authentication.refreshToken);

module.exports = router;
