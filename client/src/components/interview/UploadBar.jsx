import { useState, useRef } from "react";

const UploadBar = ({
  onGenerate,
  onUpload,
  role,
  setRole,
  difficulty,
  setDifficulty,
}) => {
  const [file, setFile] = useState(null);
  const [menu, setMenu] = useState(null);
  const [query, setQuery] = useState("");
  const fileRef = useRef();

  const handleSubmit = () => {
    onGenerate({ file, query });

    setQuery("");
    setFile(null);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full flex justify-center pb-6 bg-gradient-to-t from-[#0b0b0f] via-[#0b0b0f]/80 to-transparent">
      <div className="relative flex items-center gap-2 w-full max-w-2xl bg-white/5 border border-white/10 rounded-full px-3 py-2 backdrop-blur-md">
        {/* File Input */}
        <input
          type="file"
          ref={fileRef}
          className="hidden"
          onChange={(e) => setFile(e.target.files[0])}
        />

        {/* Upload */}
        <button
          onClick={() => fileRef.current.click()}
          className="text-gray-300 text-lg px-2 py-1 rounded-full hover:bg-white/10 transition"
        >
          +
        </button>

        {/* Query Input */}
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 outline-none px-2 text-sm bg-transparent text-white placeholder:text-gray-500"
        />

        {/* Role */}
        <button
          onClick={() => setMenu(menu === "role" ? null : "role")}
          className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition"
        >
          {role}
        </button>

        {/* Difficulty */}
        <button
          onClick={() => setMenu(menu === "difficulty" ? null : "difficulty")}
          className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition"
        >
          {difficulty}
        </button>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          className="bg-violet-500 text-white px-4 py-2 rounded-full hover:bg-violet-400 transition"
        >
          ↑
        </button>

        {/* Dropdown */}
        {menu && (
          <div className="absolute right-0 bottom-14 w-48 bg-[#0b0b0f] border border-white/10 rounded-xl shadow-lg p-2">
            <p className="text-xs text-gray-400 px-2 py-1">
              {menu === "role" ? "Select Role" : "Select Difficulty"}
            </p>

            <div className="space-y-1">
              {(menu === "role"
                ? ["Frontend", "Backend", "Fullstack"]
                : ["Easy", "Medium", "Hard"]
              ).map((item) => {
                const isActive =
                  (menu === "role" && role === item) ||
                  (menu === "difficulty" && difficulty === item);

                return (
                  <button
                    key={item}
                    onClick={() => {
                      menu === "role" ? setRole(item) : setDifficulty(item);
                      setMenu(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                    ${
                      isActive
                        ? "bg-violet-500 text-white"
                        : "text-gray-300 hover:bg-white/10"
                    }
                  `}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadBar;
