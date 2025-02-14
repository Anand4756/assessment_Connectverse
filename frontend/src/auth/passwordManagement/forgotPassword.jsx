import { useState } from "react";
import axios from "axios";
import { serverurl } from "../../constants";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${serverurl}/auth/forgot-password`, { email });
      toast.success("Reset link sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
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
          </motion.div>{" "}
          <motion.form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl px-6 py-8 space-y-6 max-w-md md:ml-auto w-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-3xl font-extrabold mb-8">Forgot Password?</h3>

            <div className="space-y-3">
              <div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-100 focus:bg-transparent w-full text-sm px-4 py-3.5 rounded-md outline-gray-800"
                  aria-required="true"
                  aria-describedby="identifier-error"
                />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    type="submit"
                    className="my-7 w-full shadow-xl py-3 px-6 text-sm font-semibold rounded-md text-white bg-gray-800 hover:bg-[#222] focus:outline-none focus:ring-2 focus:ring-gray-600"
                  >
                    Send Password reset Link
                  </button>
                </motion.div>{" "}
              </div>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
