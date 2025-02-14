import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaMusic } from "react-icons/fa";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { serverurl } from "../constants";
import { AuthContext } from "../provider/authprovider";

const Login = () => {
  const { fetchUserDetails } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.getElementById("identifier").focus();
  }, []);

  const validateField = (name, value) => {
    let error = "";
    if (name === "identifier" && !value)
      error = "Email or username is required";
    if (name === "password" && !value) error = "Password is required";

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    validateField(name, newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (Object.values(errors).every((error) => error === "")) {
      try {
        const response = await axios.post(`${serverurl}/auth/login`, {
          identifier: formData.identifier,
          password: formData.password,
        });

        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          toast.success("Login successful!");
          await fetchUserDetails();
          navigate("/"); // Redirect immediately after successful login

          // setTimeout(() => navigate("/"), 2000);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
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
              src="guitar.png"
              alt="Floating guitar icon"
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
            onSubmit={handleSubmit}
            className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-extrabold mb-12">Sign in</h3>

            <div className="space-y-3">
              <div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  value={formData.identifier}
                  onChange={handleChange}
                  className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
                  placeholder="Email or username"
                  aria-required="true"
                  aria-describedby="identifier-error"
                />
                {errors.identifier && (
                  <p
                    id="identifier-error"
                    className="text-red-500 text-sm"
                    aria-live="polite"
                  >
                    {errors.identifier}
                  </p>
                )}
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
                  placeholder="Password"
                  aria-required="true"
                  aria-describedby="password-error"
                />
                <motion.button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  whileTap={{ scale: 0.9 }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </motion.button>
                {errors.password && (
                  <p
                    id="password-error"
                    className="text-red-500 text-sm"
                    aria-live="polite"
                  >
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 shrink-0 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-labelledby="rememberMe-label"
                />
                <label
                  id="rememberMe-label"
                  htmlFor="rememberMe"
                  className="text-gray-800 ml-3 text-sm"
                >
                  Remember Me
                </label>
              </div>
              <div className="text-sm text-right">
                <Link
                  to="/forgot-password"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <button
                className="my-7 w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-gray-800 hover:bg-[#222] focus:outline-none focus:ring-2 focus:ring-gray-600 flex justify-center items-center gap-2"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaMusic className="animate-spin text-lg" />{" "}
                    {/* Spinning music icon */}
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </motion.div>

            <p className="text-sm mt-6">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-semibold underline ml-1">
                Register here
              </Link>
            </p>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
