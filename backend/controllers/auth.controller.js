require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const crypto = require("crypto");

const User = require("../models/user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../helpers/jwtToken");
const sendMail = require("../helpers/mailsend");

const logincontroller = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    res.json({ message: "Login successful", accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const verifyToken = jwt.sign(
      { id: newUser.id },
      process.env.AUTH_MAIL_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const verifyLink = `${process.env.CLIENT_URL}/verify-account/${verifyToken}`;

    await sendMail(email, "Verify Account", `Click to verify: ${verifyLink}`);

    res.status(201).json({
      message:
        "User registered successfully! Pls check your email to verify your account",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.AUTH_MAIL_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }
    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = jwt.sign({ id: user.id }, process.env.AUTH_MAIL_SECRET, {
      expiresIn: "1h",
    });

    // await user.update({ resetToken });

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendMail(
        email,
        "Password Reset Request",
        `Click to reset: ${resetLink}`
      );
      res.json({ message: "Reset link sent to email" });
    } catch (error) {
      res.status(500).json({ message: "Email could not be sent" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updatepassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(token, process.env.AUTH_MAIL_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user)
      return res.status(400).json({ message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword; // Hashing is assumed
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

const userdetail = async (req, res) => {
  console.log("line 30");

  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "updatedAt", "createdAt"] },
    });
    console.log(user);
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.log("here", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    console.log(user);
    const newaccessToken = generateAccessToken(user);

    res.json({ accessToken: newaccessToken });
  });
};

module.exports = {
  logincontroller,
  signup,
  verifyEmail,
  userdetail,
  forgotPassword,
  updatepassword,
  refreshToken,
};
