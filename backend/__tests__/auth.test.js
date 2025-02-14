const request = require("supertest");
const app = require("../index"); // Import your Express app instance
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

jest.mock("../models/user.model");
jest.mock("../helpers/mailsend");

const mockUser = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  password: bcrypt.hashSync("password123", 10),
  isVerified: false,
};

describe("Auth API Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /api/auth/signup", () => {
    it("should register a new user", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      const res = await request(app).post("/api/auth/signup").send({
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toContain("User registered successfully");
    });
  });
  describe("POST /api/auth/login", () => {
    it("should return error for invalid credentials", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app).post("/api/auth/login").send({
        identifier: "wronguser@example.com",
        password: "wrongpassword",
      });

      console.log("Test response:", res.body);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid credentials");
    });
  });

  describe("POST /api/auth/verify-email", () => {
    it("should verify email when valid token is provided", async () => {
      // Fix jwt.verify to correctly simulate a successful token verification
      jest.spyOn(jwt, "verify").mockImplementation((token, secret) => {
        return { id: mockUser.id };
      });

      // Ensure mockUser has a save() method
      const mockUser = {
        id: 1,
        isVerified: false,
        save: jest.fn(),
      };

      // Fix User.findByPk to return a valid user
      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app)
        .post("/api/auth/verify-email")
        .send({ token: "validToken" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Email verified successfully!");
    });
  });

  describe("POST /api/auth/forgot-password", () => {
    it("should send password reset email", async () => {
      User.findOne.mockResolvedValue(mockUser);
      const res = await request(app)
        .post("/api/auth/forgot-password")
        .send({ email: "test@example.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Reset link sent to email");
    });
  });

  describe("POST /api/auth/reset-password", () => {
    it("should update password when valid token is provided", async () => {
      jest.spyOn(jwt, "verify").mockImplementation((token, secret) => {
        return { id: mockUser.id };
      });

      const mockUser = {
        id: 1,
        password: "oldPassword123",
        save: jest.fn(),
      };

      User.findByPk = jest.fn().mockResolvedValue(mockUser);

      const res = await request(app).post("/api/auth/reset-password").send({
        token: "validToken",
        newPassword: "newPassword123",
      });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Password updated successfully");
    });
  });

  describe("POST /api/auth/refreshtoken", () => {
    it("should return a new access token when refresh token is valid", async () => {
      jest
        .spyOn(jwt, "verify")
        .mockImplementation((token, secret, callback) => {
          callback(null, { id: mockUser.id });
        });

      const res = await request(app)
        .post("/api/auth/refreshtoken")
        .send({ refreshToken: "validRefreshToken" });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
    });
  });
});
