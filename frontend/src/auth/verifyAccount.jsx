import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverurl } from "../constants";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VerifyAccount = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await axios.post(`${serverurl}/auth/verify-email`, {
          token,
        });
        toast.success("Email Verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to verify email");
      }
    };
    verifyEmail();
  }, [token, navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen font-[sans-serif] bg-gradient-to-r from-purple-900 via-purple-800 to-purple-600 text-gray-800">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <ToastContainer />

        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-purple-900 mb-4 mx-auto"></div>
        <h2 className="text-2xl font-semibold text-gray-700">
          Verifying your Account
        </h2>
      </div>
    </div>
  );
};

export default VerifyAccount;
