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
import PublicRoute from "../components/common/PublicRoute";

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

        <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>

<Route
  path="/signup"
  element={
    <PublicRoute>
      <Signup />
    </PublicRoute>
  }
/>

<Route
  path="/forgot-password"
  element={
    <PublicRoute>
      <ForgotPassword />
    </PublicRoute>
  }
/>

<Route
  path="/reset-password"
  element={
    <PublicRoute>
      <ResetPassword />
    </PublicRoute>
  }
/>

<Route
  path="/verify-otp"
  element={
    <PublicRoute>
      <VerifyOtp />
    </PublicRoute>
  }
/>

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

        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>

      {!hideFooterRoutes.includes(location.pathname) && <Footer />}
    </>
  );
}

export default AppRoutes;
