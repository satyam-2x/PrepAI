const Feedback = ({ feedback, score }) => {
  if (!feedback) return null;

  // Remove score line from feedback text
  const cleanFeedback = feedback.replace(/Score:\s*\d+\/10/, "").trim();

  return (
    <div className="max-w-2xl mx-auto mt-6 bg-white/5 border border-white/10 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-white mb-3">Feedback</h2>

      {score !== null && (
        <div className="mb-4">
          <span className="text-sm text-gray-400">Score</span>
          <p className="text-2xl font-semibold text-violet-400">{score}/10</p>
        </div>
      )}

      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
        {cleanFeedback}
      </p>
    </div>
  );
};

export default Feedback;
