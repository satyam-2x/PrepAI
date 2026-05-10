import { Routes, Route, useLocation } from "react-router-dom";

// ---------- Home ----------
import Home from "../pages/Home";

// ---------- Auth ----------
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import VerifyOtp from "../pages/auth/VerifyOtp";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// ---------- Dashboard ----------
import Interview from "../pages/dashboard/Interview";
import Profile from "../pages/dashboard/Profile";

// ---------- Components ----------
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import ProtectedRoute from "../components/common/ProtectedRoute";

function AppRoutes() {
  const location = useLocation();

  const hideFooterRoutes = ["/interview"];

  // Main routing component
  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* ---------- Public Routes ---------- */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ---------- Protected Routes ---------- */}
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <Interview />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default AppRoutes;
