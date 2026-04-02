import { useState } from "react";
import { useRoute, useLocation } from "wouter";
import { quizzes } from "@/data/quizzes";
import { useTrack } from "@/hooks/use-track";

export default function QuizPage() {
  const [, params] = useRoute("/quiz/:quizId");
  const [, setLocation] = useLocation();
  const track = useTrack();

  const quiz = quizzes.find((q) => q.id === params?.quizId);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!quiz) {
    return (
      <div className="page-scroll" style={{ padding: 60, textAlign: "center" }}>
        <div className="lv-empty-icon">📝</div>
        <div className="lv-empty-title">Quiz not found</div>
        <button className="chip" onClick={() => setLocation("/academy")} style={{ marginTop: 16 }}>
          Back to Academy
        </button>
      </div>
    );
  }

  const question = quiz.questions[currentQ];

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
    track("quiz_answer", {
      quizId: quiz.id,
      questionId: question.id,
      correct: index === question.correctIndex,
    });
  };

  const handleNext = () => {
    if (currentQ < quiz.questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
      track("quiz_completed", { quizId: quiz.id, score, total: quiz.questions.length });
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="page-scroll" data-testid="quiz-page">
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Back */}
        <button
          onClick={() => setLocation("/academy")}
          style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: "0.58rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text3)",
            background: "none",
            border: "none",
            cursor: "pointer",
            marginBottom: 20,
          }}
          data-testid="back-to-academy"
        >
          ← Academy
        </button>

        {/* Quiz title */}
        <h1
          style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "1.6rem",
            fontWeight: 400,
            color: "var(--text)",
            marginBottom: 6,
          }}
        >
          {quiz.title}
        </h1>
        <p
          style={{
            fontSize: "0.84rem",
            fontWeight: 300,
            color: "var(--text2)",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {quiz.description}
        </p>

        {finished ? (
          /* ── RESULTS ── */
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              background: "var(--wh)",
              border: "1px solid var(--border-c)",
              borderRadius: "var(--r)",
            }}
          >
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>
              {score === quiz.questions.length ? "🏆" : score >= quiz.questions.length / 2 ? "🎉" : "📚"}
            </div>
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.4rem",
                fontWeight: 400,
                color: "var(--text)",
                marginBottom: 8,
              }}
            >
              You got {score} out of {quiz.questions.length}!
            </h2>
            <p
              style={{
                fontSize: "0.88rem",
                fontWeight: 300,
                color: "var(--text2)",
                marginBottom: 24,
              }}
            >
              {score === quiz.questions.length
                ? "Perfect score! You really know your wine."
                : score >= quiz.questions.length / 2
                ? "Well done — you're building solid wine knowledge."
                : "Keep exploring — every glass is a lesson."}
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={handleRetry}
                data-testid="quiz-retry"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.62rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "10px 22px",
                  borderRadius: 100,
                  border: "none",
                  background: "var(--wine)",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <button
                className="chip"
                onClick={() => setLocation("/academy")}
                data-testid="quiz-explore-more"
              >
                Explore More
              </button>
            </div>
          </div>
        ) : (
          /* ── QUESTION ── */
          <div>
            {/* Progress */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.58rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text3)",
                }}
              >
                Question {currentQ + 1} of {quiz.questions.length}
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.58rem",
                  color: "var(--wine)",
                }}
              >
                Score: {score}
              </span>
            </div>
            <div
              style={{
                height: 3,
                background: "var(--bg2)",
                borderRadius: 2,
                marginBottom: 24,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${((currentQ + 1) / quiz.questions.length) * 100}%`,
                  background: "var(--wine)",
                  borderRadius: 2,
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            {/* Question text */}
            <h2
              style={{
                fontFamily: "'Fraunces', serif",
                fontSize: "1.15rem",
                fontWeight: 500,
                color: "var(--text)",
                lineHeight: 1.3,
                marginBottom: 20,
              }}
            >
              {question.question}
            </h2>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {question.options.map((option, i) => {
                let bg = "var(--wh)";
                let borderColor = "var(--border-c)";
                let textColor = "var(--text)";

                if (showExplanation) {
                  if (i === question.correctIndex) {
                    bg = "rgba(74,122,82,0.1)";
                    borderColor = "var(--sage)";
                    textColor = "var(--sage)";
                  } else if (i === selectedAnswer && i !== question.correctIndex) {
                    bg = "rgba(140,28,46,0.06)";
                    borderColor = "var(--wine)";
                    textColor = "var(--wine)";
                  }
                } else if (i === selectedAnswer) {
                  borderColor = "var(--wine)";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    data-testid={`quiz-option-${i}`}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12,
                      padding: "14px 16px",
                      borderRadius: "var(--r-sm)",
                      border: `1px solid ${borderColor}`,
                      background: bg,
                      cursor: showExplanation ? "default" : "pointer",
                      transition: "all 0.15s",
                      textAlign: "left",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: "0.62rem",
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: showExplanation && i === question.correctIndex ? "var(--sage)" : "var(--bg)",
                        border: `1px solid ${showExplanation && i === question.correctIndex ? "var(--sage)" : "var(--border2-c)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        color: showExplanation && i === question.correctIndex ? "white" : "var(--text3)",
                      }}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span
                      style={{
                        fontSize: "0.86rem",
                        fontWeight: 300,
                        color: textColor,
                        lineHeight: 1.5,
                      }}
                    >
                      {option}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div
                style={{
                  padding: "14px 18px",
                  background: "var(--bg)",
                  borderRadius: "var(--r-sm)",
                  border: "1px solid var(--border-c)",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: "0.56rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: selectedAnswer === question.correctIndex ? "var(--sage)" : "var(--wine)",
                    marginBottom: 6,
                  }}
                >
                  {selectedAnswer === question.correctIndex ? "✓ Correct!" : "✗ Not quite"}
                </div>
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 300,
                    color: "var(--text2)",
                    lineHeight: 1.6,
                  }}
                >
                  {question.explanation}
                </p>
              </div>
            )}

            {/* Next button */}
            {showExplanation && (
              <button
                onClick={handleNext}
                data-testid="quiz-next"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.62rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  padding: "10px 24px",
                  borderRadius: 100,
                  border: "none",
                  background: "var(--wine)",
                  color: "white",
                  cursor: "pointer",
                  float: "right",
                }}
              >
                {currentQ === quiz.questions.length - 1 ? "See Results" : "Next Question →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
