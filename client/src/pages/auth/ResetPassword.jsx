import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { resetPassword } from "../../services/authService";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: emailFromState || "",
    otp: "",
    newPassword: "",
  });

  // Auto-clear message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "otp" && !/^\d*$/.test(value)) {
      return;
    }

    if (name === "password") {
      if (value.length < 8) {
        setPasswordStrength("Weak");
      } else if (
        /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)
      ) {
        setPasswordStrength("Strong");
      } else {
        setPasswordStrength("Medium");
      }
    }

    setForm({ ...form, [name]: value });
  };

  // Handle reset password
  const handleSubmit = async () => {
    if (!form.otp || !form.newPassword) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    if (!/^\d{6}$/.test(form.otp)) {
      setMessage("Please enter a valid 6-digit OTP");
      setType("error");
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters");
      setType("error");
      return;
    }

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password)
    ) {
      setMessage(
        "Password must contain uppercase, lowercase, number and symbol"
      );
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword(form);

      setMessage(res.data.message || "Password reset successful");
      setType("success");

      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || "Error");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-5 text-center text-white">
          Reset Password
        </h2>

        {message && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm
      ${type === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-300"
                : "bg-green-500/10 border-green-500/20 text-green-300"
              }
    `}
          >
            {type === "error" ? (
              <HiOutlineExclamationCircle className="text-red-300 text-lg" />
            ) : (
              <HiOutlineCheckCircle className="text-green-300 text-lg" />
            )}

            <p>{message}</p>
          </div>
        )}


        <input
          type="email"
          name="email"
          value={form.email}
          readOnly
          className="w-full p-2.5 mb-3 rounded-md bg-white/5 border border-white/10 text-gray-400"
        />


        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          maxLength={6}
          value={form.otp}
          onChange={handleChange}
          className="w-full p-2.5 mb-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
        />


        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 pr-10 focus:outline-none focus:border-violet-400"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {passwordStrength && (
          <p
            className={`text-xs mt-1 mb-4 ${passwordStrength === "Weak"
              ? "text-red-400"
              : passwordStrength === "Medium"
                ? "text-yellow-400"
                : "text-green-400"
              }`}
          >
            Password Strength: {passwordStrength}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2.5 rounded-md font-medium transition ${loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-violet-500 hover:bg-violet-400"
            } text-white`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>


        <p className="text-sm mt-4 text-center text-gray-400">
          Back to{" "}
          <Link to="/login" className="text-violet-400 hover:underline">
            Login
          </Link>
        </p>

        <p className="text-sm mt-4 text-center">
          <Link to="/" className="text-violet-400 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
