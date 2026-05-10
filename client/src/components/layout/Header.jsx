import { HiOutlineClock, HiOutlineSparkles } from "react-icons/hi";

const Header = ({ credits = 0, time = 0, onToggleSidebar }) => {
  // Convert seconds into MM:SS format
  const formatTime = (t) => {
    const min = Math.floor(t / 60);
    const sec = t % 60;

    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center px-6 py-4 bg-[#0b0b0f] border-b border-white/10">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded-md transition"
        >
          ☰
        </button>

        <h1 className="text-lg font-semibold tracking-tight cursor-pointer">
          Prep<span className="text-violet-400">AI</span>
        </h1>
      </div>

      {/* Status */}
      <div className="flex items-center gap-4">
        {/* Timer */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
          <HiOutlineClock className="text-violet-400 text-base animate-pulse" />
          <span className="text-sm text-white font-medium tracking-wide">
            {formatTime(time)}
          </span>
        </div>

        {/* Credits */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
          <HiOutlineSparkles className="text-violet-400 text-base" />
          <span className="text-sm text-white font-medium">{credits}</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
