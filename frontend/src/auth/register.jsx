import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import { serverurl } from "../constants";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    profilePicture: "",
    termsAccepted: false,
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "password":
        if (
          !/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(value)
        ) {
          error =
            "Password must have at least 6 characters, one uppercase letter, one number, and one special character";
        }
        break;
      case "confirmPassword":
        if (value !== formData.password) error = "Passwords do not match";
        break;
      case "termsAccepted":
        if (!value) error = "You must accept the terms and conditions";
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    validateField(name, newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      Object.values(errors).every((error) => error === "") &&
      formData.termsAccepted
    ) {
      try {
        const response = await axios.post(`${serverurl}/auth/signup`, {
          username: formData.name,
          email: formData.email,
          password: formData.password,
        });

        if (response.data) {
          toast.success("Registration successful! Pls check your mail");
          setTimeout(() => {
            navigate("/login");
          }, 4000);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Registration failed");
      }
    }
  };

  return (
    <div className="font-[sans-serif] bg-gradient-to-r from-purple-900 via-purple-800 to-purple-600 text-gray-800">
      <div className="min-h-screen flex flex-col items-center justify-center lg:p-6 p-4">
        <ToastContainer />
        <motion.div
          className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Left Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="lg:text-5xl text-3xl font-extrabold lg:leading-[50px] text-white">
              MelodyVerse
            </h1>

            {/* Animated Floating Icons */}
            <motion.img
              className="absolute w-1/12 left-1/3 top-3/4"
              src="music.png"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />

            <p className="text-lg mt-6 text-white">
              MelodyVerse is a next-generation music streaming platform designed
              for true music lovers. With a vast library of songs, personalized
              playlists, and immersive sound quality, MelodyVerse offers an
              unparalleled listening experience.
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.form
            className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
          >
            <h3 className="text-3xl font-extrabold mb-4">Register</h3>

            <input
              name="email"
              type="text"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
              />

              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}

            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}

            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter name (optional)"
              className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
            />
            <label htmlFor="uploadFile1">
              <div className="my-7 p-4 border border-dashed rounded-lg border-customorange flex flex-col items-center justify-center">
                <img src="profile.svg" width={40} />

                <h3 className="text-customorange my-4">Upload Profile Pic</h3>
                <input
                  type="file"
                  onChange={handleChange}
                  accept=".xlsx"
                  id="uploadFile1"
                  className="hidden"
                />
              </div>
            </label>

            <div className="flex items-center mt-6">
              <input
                required
                id="terms"
                name="termsAccepted"
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={handleChange}
                className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-gray-800 ml-3 text-sm">
                I accept the terms and conditions
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm">{errors.termsAccepted}</p>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                type="submit"
                className="w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-gray-800 hover:bg-[#222] focus:outline-none focus:ring-2 focus:ring-gray-600"
              >
                Sign Up
              </button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
