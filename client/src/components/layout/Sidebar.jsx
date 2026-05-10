import { useNavigate } from "react-router-dom";
import { HiOutlineCog } from "react-icons/hi";

const Sidebar = ({ open, onClose, history, onSelect, onNew, onHome }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* Sidebar */}
      <div className="fixed top-0 left-0 h-full w-64 bg-[#0b0b0f] border-r border-white/10 p-4 z-50 flex flex-col">
       
        <div className="space-y-3">
          
          <button
            onClick={onNew}
            className="w-full bg-violet-500 text-white py-2 rounded-md hover:bg-violet-400 transition"
          >
            + New Interview
          </button>

          <button
            onClick={onHome}
            className="w-full bg-white/5 border border-white/10 text-white py-2 rounded-md hover:bg-white/10 transition"
          >
            Home
          </button>
        </div>

        {/* Interview History */}
        <div className="mt-6 flex-1 overflow-y-auto">
          <h3 className="text-xs uppercase tracking-wide text-gray-400 mb-3">
            History
          </h3>

          <div className="space-y-2">
            {history.length === 0 ? (
              <p className="text-gray-500 text-sm">No history available</p>
            ) : (
              history.map((item) => (
                <button
                  key={item._id}
                  onClick={() => onSelect(item._id)}
                  className="w-full text-left bg-white/5 border border-white/10 px-3 py-2 rounded-md hover:bg-white/10 transition"
                >
                  <p className="text-sm text-white font-medium">
                    {item.role} ({item.difficulty})
                  </p>

                  <p className="text-xs text-gray-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </p>

                  <div className="flex justify-between mt-1 text-xs">
                    <span
                      className={`${
                        item.status?.toLowerCase() === "completed" || item.score
                          ? "text-green-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {item.status?.toLowerCase() === "completed" || item.score
                        ? "Completed"
                        : "Incomplete"}
                    </span>

                    <span className="text-violet-400">
                      {item.score ? `${item.score}/10` : "-"}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white px-3 py-2 rounded-lg transition"
          >
            <HiOutlineCog className="text-violet-400 text-lg" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
