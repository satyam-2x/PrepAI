import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0b0b0f]">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">
          P
        </div>

        <h1 className="text-lg font-semibold tracking-tight">
          Prep<span className="text-violet-400">AI</span>
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="bg-violet-500/90 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-500 transition"
            >
              Get Started
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/interview")}
              className="text-sm text-gray-400 hover:text-white transition"
            >
              Interview
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="bg-violet-500/90 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-violet-500 transition"
            >
              Profile
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
