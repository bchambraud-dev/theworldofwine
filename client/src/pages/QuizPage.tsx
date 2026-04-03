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
        <div className="lv-empty-icon"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
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
              {score === quiz.questions.length ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>
              ) : score >= quiz.questions.length / 2 ? (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--wine)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              )}
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
