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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.otp || !form.newPassword) {
      setMessage("Please fill all fields");
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
      ${
        type === "error"
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

        
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2.5 rounded-md font-medium transition ${
            loading
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
