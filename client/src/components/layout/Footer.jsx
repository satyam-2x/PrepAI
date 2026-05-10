import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import { PiBracketsCurlyBold } from "react-icons/pi";

function Footer() {
  const token = localStorage.getItem("token");

  return (
    <footer className="bg-[#0b0b0f] border-t border-white/10 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start">
          <h2 className="text-lg font-semibold text-white mb-2">
            Prep<span className="text-violet-400">AI</span>
          </h2>

          <p className="text-sm text-gray-400">
            AI-powered interview practice platform to help you prepare smarter
            and perform better.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-sm font-medium text-white mb-3">Quick Links</h3>

          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link to="/" className="hover:text-white transition">
              Home
            </Link>

            {!token ? (
              <>
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>

                <Link to="/signup" className="hover:text-white transition">
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link to="/interview" className="hover:text-white transition">
                  Interview
                </Link>

                <Link to="/profile" className="hover:text-white transition">
                  Profile
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-sm font-medium text-white mb-3">Connect</h3>

          <p className="text-sm text-gray-400 mb-3">
            Email:{" "}
            <a
              href="mailto:satyamkumarroy216@gmail.com"
              className="text-violet-400 hover:underline"
            >
              satyamkumarroy216@gmail.com
            </a>
          </p>

          {/* Social Links */}
          <div className="flex gap-4 text-sm text-gray-400">
            <a
              href="https://github.com/satyam-2x"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              <FaGithub />
            </a>

            <a
              href="https://linkedin.com/in/satyamkumarray"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://instagram.com/iam_satyam55"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition"
            >
              <FaInstagram />
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-3 flex items-center gap-1">
            Built with{" "}
            <PiBracketsCurlyBold className="text-violet-400 text-base" /> for
            developers
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-xs text-gray-500 pb-6">
        © {new Date().getFullYear()} PrepAI. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
