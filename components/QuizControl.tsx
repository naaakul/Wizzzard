"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

interface QuizQuestion {
  text: string;
  timeLimit: number;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuizParticipant {
  uid: string;
  username: string;
  score: number;
  answers?: {
    questionIndex: number;
    selectedOption: number;
    isCorrect: boolean;
    timeTaken: number;
  }[];
}

interface QuizData {
  id: string;
  title: string;
  status: "waiting" | "active" | "completed";
  currentQuestion: number;
  questions: QuizQuestion[];
  participants: QuizParticipant[];
  createdBy: {
    uid: string;
    username: string;
  };
}

// interface PageProps {
//   params: {
//     quizId: string;
//   };
//   searchParams?: Record<string, string | string[] | undefined>;
// }

const QuizControl = ({ quizId }: any) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [questionActive, setQuestionActive] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, "quizzes", quizId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as Omit<QuizData, "id">;
          setQuiz({ ...data, id: doc.id });

          if (data.status === "completed") {
            router.push(`/game/results/${quizId}`);
          }

          if (data.status === "active" && data.currentQuestion >= 0) {
            const currentQuestionData = data.questions[data.currentQuestion];
            if (currentQuestionData) {
              setQuestionActive(true);
            }
          } else {
            setQuestionActive(false);
          }
        } else {
          setError("Quiz not found");
        }
      },
      (error) => {
        setError("Error loading quiz: " + error.message);
      }
    );

    return () => unsubscribe();
  }, [quizId, user, router]);

  useEffect(() => {
    if (!quiz || !user) return;

    if (quiz.createdBy.uid !== user.uid) {
      router.push(`/game/join/${quizId}`);
    }
  }, [quiz, user, quizId, router]);

  useEffect(() => {
    if (!quiz || !questionActive) {
      setTimeLeft(null);
      return;
    }

    const currentQuestion = quiz.questions[quiz.currentQuestion];
    if (!currentQuestion) return;

    setTimeLeft(currentQuestion.timeLimit);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          if (prev === 1) {
            handleEndQuestion();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, questionActive]);

  const handleShowQuestion = async () => {
    if (!quiz || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      await updateDoc(doc(db, "quizzes", quizId), {
        currentQuestion: quiz.currentQuestion,
      });

      setQuestionActive(true);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while showing the question");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndQuestion = async () => {
    if (!quiz || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      setQuestionActive(false);

      await updateDoc(doc(db, "quizzes", quizId), {
        currentQuestion: -2,
      });
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while ending the question");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!quiz || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      const nextQuestion = quiz.currentQuestion + 1;

      if (nextQuestion >= quiz.questions.length) {
        await updateDoc(doc(db, "quizzes", quizId), {
          status: "completed",
        });
        router.push(`/game/results/${quizId}`);
      } else {
        await updateDoc(doc(db, "quizzes", quizId), {
          currentQuestion: nextQuestion,

          status: "active",
        });

        setQuestionActive(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while moving to the next question");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndQuiz = async () => {
    if (!quiz || isProcessing) return;

    setIsProcessing(true);
    setError("");

    try {
      await updateDoc(doc(db, "quizzes", quizId), {
        status: "completed",
      });

      router.push(`/game/results/${quizId}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while ending the quiz");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  const currentQuestion =
    quiz.currentQuestion >= 0 ? quiz.questions[quiz.currentQuestion] : null;

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <div className="flex items-center gap-3">
            <p className="text-zinc-400">
              Question {quiz.currentQuestion + 1} of {quiz.questions.length}
            </p>
            {timeLeft !== null && questionActive && (
              <div className="bg-zinc-800 py-2 px-4 rounded-lg">
                <p className="text-2xl font-bold">{timeLeft}s</p>
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Current Question Display */}
        {currentQuestion && (
          <div className="mb-8 bg-zinc-900 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {currentQuestion.text}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg flex items-center ${
                    questionActive
                      ? "bg-zinc-800"
                      : option.isCorrect
                      ? "bg-green-600"
                      : "bg-zinc-800"
                  }`}
                >
                  <span className="mr-3 font-bold text-lg">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <p>{option.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Participants */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Participants ({quiz.participants.length})
            </h2>
          </div>

          <div className="bg-zinc-900 rounded-lg p-4 max-h-40 overflow-y-auto">
            {quiz.participants.map((participant) => (
              <div
                key={participant.uid}
                className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0"
              >
                <p className="font-medium">{participant.username}</p>
                <p>{participant.score} points</p>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-4">
          {currentQuestion && !questionActive && (
            <button
              onClick={handleShowQuestion}
              disabled={isProcessing}
              className={`bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-lg ${
                isProcessing ? "opacity-50" : ""
              }`}
            >
              Show Question
            </button>
          )}

          {questionActive && (
            <button
              onClick={handleEndQuestion}
              disabled={isProcessing}
              className={`bg-yellow-600 hover:bg-yellow-500 px-6 py-3 rounded-lg ${
                isProcessing ? "opacity-50" : ""
              }`}
            >
              End Question Early
            </button>
          )}

          {!questionActive &&
            quiz.currentQuestion >= 0 &&
            quiz.currentQuestion < quiz.questions.length - 1 && (
              <button
                onClick={handleNextQuestion}
                disabled={isProcessing}
                className={`bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg ${
                  isProcessing ? "opacity-50" : ""
                }`}
              >
                Next Question
              </button>
            )}

          <button
            onClick={handleEndQuiz}
            disabled={isProcessing}
            className={`bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg ${
              isProcessing ? "opacity-50" : ""
            }`}
          >
            End Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizControl;
