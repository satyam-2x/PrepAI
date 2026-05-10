import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../../services/profileService";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // User state
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  // Alert state
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  // Password visibility state
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);

  // UI state
  const [loading, setLoading] = useState(true);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  // Password form state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [deletePassword, setDeletePassword] = useState("");

  // Auto-clear alert message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setType("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(token);

        setUser(res.data.user);
        setName(res.data.user.name);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("resumeId");

        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Update profile name
  const handleUpdate = async () => {
    try {
      await updateProfile({ name }, token);
      setMessage("Profile updated successfully");
      setType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      setType("error");
    }
  };

  // Change account password
  const handleChangePassword = async () => {
    try {
      await changePassword({ oldPassword, newPassword }, token);
      setMessage("Password changed successfully");
      setType("success");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      setType("error");
    }
  };

  // Delete user account
  const handleDelete = async () => {
    try {
      await deleteAccount({ password: deletePassword }, token);
      setMessage("Account deleted successfully");
      setType("success");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("resumeId");
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
      setType("error");
    }
  };

  // Logout current user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white px-4 py-8">
      <div className="max-w-xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-center">Profile</h1>

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

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <p className="text-sm text-gray-400">Email</p>
          <p className="mb-3">{user?.email}</p>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-violet-400"
          />

          <button
            onClick={handleUpdate}
            className="mt-3 bg-violet-500 px-4 py-2 rounded-md hover:bg-violet-400 transition"
          >
            Update Name
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-violet-500 px-4 py-2 rounded-md hover:bg-violet-400 transition"
          >
            Change Password
          </button>

          {showPasswordForm && (
            <div className="mt-4 space-y-3">
              <div className="relative">
                <input
                  type={showOld ? "text" : "password"}
                  placeholder="Old Password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white pr-10 focus:outline-none focus:border-violet-400"
                />
                <span
                  onClick={() => setShowOld(!showOld)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
                >
                  {showOld ? "🙈" : "👁️"}
                </span>
              </div>

              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2.5 rounded-md bg-white/5 border border-white/10 text-white pr-10 focus:outline-none focus:border-violet-400"
                />

                <span
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 cursor-pointer text-gray-400 hover:text-white"
                >
                  {showNew ? "🙈" : "👁️"}
                </span>
              </div>

              <button
                onClick={handleChangePassword}
                className="bg-violet-500 px-4 py-2 rounded-md hover:bg-violet-400 transition"
              >
                Update Password
              </button>
            </div>
          )}
        </div>

        <div className="bg-white/5 border border-red-500/20 rounded-xl p-5">
          <input
            type="password"
            placeholder="Confirm Password"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full p-2.5 mb-3 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-red-400"
          />

          <button
            onClick={handleDelete}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-400 transition"
          >
            Delete Account
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
