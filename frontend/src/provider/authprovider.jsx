import { createContext, useState, useEffect } from "react";
import instance from "../axiosinterceptor";
import { serverurl } from "../constants";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores user data
  const [loading, setLoading] = useState(true);

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await instance.get(`${serverurl}/auth/userdetail`); // Adjust API endpoint as needed
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details on mount if accessToken exists
  useEffect(() => {
    console.log("Fetching user details...");
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, fetchUserDetails }}>
      {children}
    </AuthContext.Provider>
  );
};
