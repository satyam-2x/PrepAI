import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword } from "../../services/authService";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

function ForgotPassword() {
  const navigate = useNavigate();

  // State management
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Handle form submission
  const handleSubmit = async () => {
    if (loading) return;

    if (!email) {
      setMessage("Please enter your email");
      setType("error");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await forgotPassword({ email });

      setMessage(res.data.message || "OTP sent");
      setType("success");

      // Redirect to reset password page
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-xl">
        <h2 className="text-2xl font-semibold mb-5 text-center text-white">
          Forgot Password
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
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2.5 mb-4 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
        />


        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full p-2.5 rounded-md font-medium transition ${loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-violet-500 hover:bg-violet-400"
            } text-white`}
        >
          {loading ? "Sending..." : "Send OTP"}
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

export default ForgotPassword;
