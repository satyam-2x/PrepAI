import { useState, useEffect } from "react";
import UploadBar from "../../components/interview/UploadBar";
import QuestionList from "../../components/interview/QuestionList";
import Feedback from "../../components/interview/Feedback";
import Header from "../../components/layout/Header";
import Sidebar from "../../components/layout/Sidebar";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import {
  uploadResume,
  generateQuestions,
  saveAnswers,
  getFeedback,
  getAllInterviews,
  getInterviewById,
} from "../../services/interviewService";

function Interview() {
  // Interview state
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(null);

  // Session state
  const [resumeId, setResumeId] = useState(null);
  const [interviewId, setInterviewId] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);

  // Interview settings
  const [role, setRole] = useState("Frontend");
  const [difficulty, setDifficulty] = useState("Easy");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [credits, setCredits] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Timer state
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Start interview timer
  useEffect(() => {
    let interval;

    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Restore saved resume ID
  useEffect(() => {
    const saved = localStorage.getItem("resumeId");
    if (saved) {
      setResumeId(saved);
    }
  }, []);

  // Auto-clear error message
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Fetch interview history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getAllInterviews();

        setHistory(res.data.interviews);
        setCredits(res.data.credits);
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, []);

  // Auto-save interview answers
  useEffect(() => {
    if (interviewId && Object.keys(answers).length > 0) {
      saveAnswers({
        interviewId,
        answers: Object.values(answers),
      });
    }
  }, [answers]);

  // Generate interview feedback
  const handleGenerate = async ({ file, query, error }) => {
    if (loading) return;

    const hasIncompleteInterview = history.some(
      (item) => item.status === "incomplete" && item._id !== interviewId,
    );

    if (hasIncompleteInterview) {
      setError("Please complete your current interview first");
      return;
    }

    if (error) {
      setError(error);
      return;
    }

    try {
      setError("");
      setLoading(true);

      let currentResumeId = resumeId;

      if (file) {
        const formData = new FormData();
        formData.append("resume", file);

        const uploadRes = await uploadResume(formData);
        currentResumeId = uploadRes.data.resumeId;

        setResumeId(currentResumeId);
        localStorage.setItem("resumeId", currentResumeId);
      }

      if (!currentResumeId) {
        setError("Upload resume once to start interview");
        return;
      }

      setQuestions([]);
      setAnswers({});
      setFeedback("");
      setScore(null);

      const res = await generateQuestions({
        resumeId: currentResumeId,
        role,
        difficulty,
        query: query || "",
      });

      setQuestions(res.data.questions);
      setInterviewId(res.data.interviewId);

      setCredits(res.data.credits);

      const historyRes = await getAllInterviews();

      setHistory(historyRes.data.interviews);
      setCredits(historyRes.data.credits);

      setAnswers({});
      setFeedback("");
      setScore(null);
      setIsReadOnly(false);

      setTime(0);
      setIsTimerRunning(true);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Unable to generate questions right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async () => {
    try {
      setError("");

      if (!questions.length) {
        setError("Generate questions first");
        return;
      }

      if (Object.keys(answers).length !== questions.length) {
        setError("Answer all questions");
        return;
      }

      setLoading(true);

      const res = await getFeedback({
        interviewId,
        questions,
        answers: Object.values(answers),
      });

      const feedbackText = res.data.feedback;

      const match = feedbackText.match(/Score:\s*(\d+)/);
      const extractedScore = match ? match[1] : null;

      setFeedback(feedbackText);
      setScore(extractedScore);

      setIsTimerRunning(false);

      const historyRes = await getAllInterviews();

      setHistory(historyRes.data.interviews);
      setCredits(historyRes.data.credits);
    } catch (error) {
      console.error(error);
      setError(
        error.response?.data?.message ||
          "Unable to generate feedback right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b0b0f] min-h-screen text-white pb-32">
      <Header
        credits={credits}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        time={time}
      />

      {error && (
        <div className="max-w-2xl mx-auto mt-4">
          <div className="flex flex-col gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            <div className="flex items-center gap-2">
              <HiOutlineExclamationCircle className="text-red-300 text-lg" />

              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      <Sidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        history={history}
        onHome={() => {
          setIsSidebarOpen(false);

          if (currentSession) {
            setQuestions(currentSession.questions || []);
            setAnswers(currentSession.answers || {});
            setFeedback(currentSession.feedback || "");
            setScore(currentSession.score || null);
            setInterviewId(currentSession.interviewId || null);
            setResumeId(currentSession.resumeId || null);
          } else {
            setQuestions([]);
            setAnswers({});
            setFeedback("");
            setScore(null);
            setInterviewId(null);
            setResumeId(null);
          }

          setIsReadOnly(false);
        }}
        onNew={() => {
          if (questions.length > 0 && !feedback) {
            setError("Please complete the current interview first");
            return;
          }

          setQuestions([]);
          setAnswers({});
          setFeedback("");
          setScore(null);
          setInterviewId(null);
          setIsReadOnly(false);
          setIsSidebarOpen(false);
        }}
        onSelect={async (id) => {
          try {
            if (!isReadOnly) {
              setCurrentSession({
                questions,
                answers,
                feedback,
                score,
                interviewId,
                resumeId,
              });
            }

            const res = await getInterviewById(id);
            const data = res.data;

            setQuestions(data.questions);
            setAnswers(
              (data.answers || []).reduce((acc, val, i) => {
                acc[i] = val;
                return acc;
              }, {}),
            );
            setFeedback(data.feedback || "");
            setScore(data.score || null);
            setInterviewId(data._id);
            setResumeId(data.resumeId);

            setIsReadOnly(data.status === "completed");
            setIsSidebarOpen(false);
          } catch (error) {
            console.error(error);
          }
        }}
      />

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        <UploadBar
          onGenerate={handleGenerate}
          role={role}
          setRole={setRole}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
        />

        {questions.length > 0 && (
          <QuestionList
            questions={questions}
            answers={answers}
            setAnswers={setAnswers}
            isReadOnly={isReadOnly}
          />
        )}

        {questions.length === 0 && !loading && (
          <div className="flex justify-center mt-28 px-4">
            <h2 className="text-3xl md:text-3xl font-semibold mt-15 tracking-tight text-white/80 text-center leading-tight">
              Practice interviews with smarter AI.
            </h2>
          </div>
        )}

        {loading && (
          <div className="flex justify-center">
            <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {questions.length > 0 && !isReadOnly && (
          <div className="flex justify-center">
            <button
              onClick={handleFeedback}
              disabled={loading || feedback}
              className="bg-violet-500 text-white px-6 py-2.5 rounded-full hover:bg-violet-400 disabled:opacity-50 transition"
            >
              Evaluate Answers
            </button>
          </div>
        )}

        {feedback && (
          <div className="flex flex-col items-center gap-4">
            <Feedback feedback={feedback} score={score} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Interview;
