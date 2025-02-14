import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Register from "./auth/register";
import ForgotPassword from "./auth/passwordManagement/forgotPassword";
import ResetPassword from "./auth/passwordManagement/resetPassword";
import VerifyAccount from "./auth/verifyAccount";
import Home from "./Home";
import { AuthProvider } from "./provider/authprovider";
import ProtectedRoute from "./protectedRoute";
function App() {
  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-account/:token" element={<VerifyAccount />} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;
