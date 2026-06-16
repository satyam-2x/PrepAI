import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup, sendOtp, verifyOtp } from "../../services/authService";
import {
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

function Signup() {
  const navigate = useNavigate();
  const emailRegex = /^\S+@\S+\.\S+$/;

  // State management
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
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

  // OTP countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && !/^[A-Za-z\s]*$/.test(value)) {
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

  // Send OTP
  const handleSendOtp = async () => {
    if (!form.email) {
      setMessage("Please enter your email");
      setType("error");
      return;
    }

    if (!emailRegex.test(form.email)) {
      setMessage("Please enter a valid email");
      setType("error");
      return;
    }

    try {
      const res = await sendOtp(form.email);

      setMessage(res.data.message);
      setType("success");

      setOtpSent(true);
      setTimer(60);

    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to send OTP");
      setType("error");
    }
  };

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp) {
      setMessage("Please enter otp");
      setType("error");
      return;
    }

    try {
      const res = await verifyOtp(form.email, otp);

      setMessage(res.data.message);
      setType("success");

      setEmailVerified(true);
      setOtpSent(false);

    } catch (error) {
      setMessage(error.response?.data?.message || "OTP verification failed");
      setType("error");
    }
  };

  // Handle signup submission
  const handleSubmit = async () => {
    if (loading) return;

    if (!form.name || !form.email || !form.password) {
      setMessage("Please fill all fields");
      setType("error");
      return;
    }

    if (!/^[A-Za-z\s]+$/.test(form.name)) {
      setMessage("Name can contain only letters");
      setType("error");
      return;
    }

    if (!emailRegex.test(form.email)) {
      setMessage("Please enter a valid email");
      setType("error");
      return;
    }

    if (form.password.length < 8) {
      setMessage("Password must be at least 8 characters");
      setType("error");
      return;
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(form.password)) {
      setMessage("Password must contain uppercase, lowercase, number and symbol");
      setType("error");
      return;
    }

    if (!emailVerified) {
      setMessage("Please verify your email first");
      setType("error");
      return;
    }

    try {
      setLoading(true);

      const res = await signup(form);

      setMessage(res.data.message);
      setType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
      setType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 backdrop-blur-md p-6 rounded-xl">
        <h2 className="text-2xl font-semibold text-center text-white mb-5">
          Create your Prep<span className="text-violet-400">AI</span> account
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
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2.5 mb-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
        />

        <div className="flex gap-2 mb-3">
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            className="flex-1 p-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
          />

          {!emailVerified && (
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={timer > 0}
              className="px-3 rounded-md bg-violet-500 text-white text-sm disabled:opacity-50"
            >
              {timer > 0 ? `${timer}s` : "Send OTP"}
            </button>
          )}
        </div>

        {otpSent && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              maxLength={6}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) {
                  setOtp(e.target.value);
                }
              }}
              className="w-full p-2.5 mb-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full p-2.5 mb-3 rounded-md bg-green-600 text-white"
            >
              Verify OTP
            </button>
          </>
        )}

        {emailVerified && (
          <p className="text-green-400 text-sm mb-3">
            ✓ Email Verified
          </p>
        )}

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={form.password}
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
          {loading ? "Signing up..." : "Signup"}
        </button>

        <p className="text-sm mt-4 text-center text-gray-400">
          Already have an account?{" "}
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

export default Signup;
