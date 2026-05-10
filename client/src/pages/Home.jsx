import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

function Home() {
  const navigate = useNavigate();

  // Handle interview navigation
  const handleStart = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      navigate("/interview");
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0f] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 text-center">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-4 tracking-tight">
            Prepare for Interviews <br />
            with Smarter AI
          </h2>

          <p className="text-gray-400 mb-8 text-base">
            Personalized questions based on your resume, designed to help you
            improve faster and perform better.
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={handleStart}
              className="bg-violet-500 text-white px-6 py-3 rounded-md font-medium hover:bg-violet-400 transition"
            >
              Start Interview
            </button>
          </div>
        </div>
      </main>

      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Resume-Based Generation",
              desc: "Questions are generated based on your projects, skills, and experience.",
            },
            {
              title: "Interview-Oriented Practice",
              desc: "Simulates real technical interview patterns for better preparation.",
            },
            {
              title: "Performance Feedback",
              desc: "Get clear insights to identify gaps and improve your responses.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl p-5 hover:border-white/20 transition"
            >
              <h3 className="font-medium mb-2 text-white">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
