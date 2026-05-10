const QuestionList = ({ questions, answers, setAnswers, isReadOnly }) => {
  if (!questions.length) return null;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      <h2 className="text-lg font-semibold text-white">Questions</h2>

      {questions.map((q, index) => (
        <div
          key={`${q}-${index}`}
          className="bg-white/5 border border-white/10 rounded-xl p-4"
        >
          <p className="text-sm font-medium text-white mb-3">
            Q{index + 1}. {q}
          </p>

          {/* Answer input */}
          <textarea
            disabled={isReadOnly}
            placeholder="Type your answer..."
            value={answers[index] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [index]: e.target.value,
              }))
            }
            className="w-full min-h-[100px] text-sm bg-[#0b0b0f] text-gray-200 border border-white/10 rounded-lg p-3 outline-none focus:border-violet-400 resize-none disabled:opacity-60"
          />
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
