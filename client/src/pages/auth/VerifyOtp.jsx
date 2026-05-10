import { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { verifyOtp } from "../../services/authService";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const emailFromState = location.state?.email;

  // State management
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: emailFromState || "",
    otp: "",
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
    if (!form.otp) {
      setMessage("Enter OTP");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(form);

      setMessage("Account verified successfully");
      setType("success");

      // Redirect to login
      setTimeout(() => navigate("/login"), 1000);
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
          Verify OTP
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
          className="w-full p-2.5 mb-4 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2.5 rounded-md font-medium transition ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-violet-500 hover:bg-violet-400"
          } text-white`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-sm mt-4 text-center">
          <Link to="/" className="text-violet-400 hover:underline">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOtp;
