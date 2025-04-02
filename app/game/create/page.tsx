// app/game/create/page.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Define Question type
interface QuestionOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  timeLimit: number; // in seconds
  options: QuestionOption[];
}

const CreateQuiz = () => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      timeLimit: 30,
      options: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  ]);
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  const handleQuestionChange = (index: number, field: keyof Question, value: string | number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    // Reset all options to false
    updatedQuestions[questionIndex].options.forEach((option, idx) => {
      option.isCorrect = idx === optionIndex;
    });
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        timeLimit: 30,
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      const updatedQuestions = [...questions];
      updatedQuestions.splice(index, 1);
      setQuestions(updatedQuestions);
    }
  };

  const validateQuiz = () => {
    if (!quizTitle.trim()) {
      setError("Quiz title is required");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.text.trim()) {
        setError(`Question ${i + 1} text is required`);
        return false;
      }

      if (question.timeLimit < 5 || question.timeLimit > 300) {
        setError(`Question ${i + 1} time limit should be between 5 and 300 seconds`);
        return false;
      }

      let hasCorrectOption = false;
      for (let j = 0; j < question.options.length; j++) {
        const option = question.options[j];
        if (!option.text.trim()) {
          setError(`Option ${j + 1} for Question ${i + 1} is required`);
          return false;
        }
        if (option.isCorrect) {
          hasCorrectOption = true;
        }
      }

      if (!hasCorrectOption) {
        setError(`Question ${i + 1} must have a correct option selected`);
        return false;
      }
    }

    return true;
  };

  const createQuiz = async () => {
    if (!validateQuiz()) return;
    if (!user) return;

    setIsCreating(true);
    setError("");

    try {
      // Generate a 6 digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Save quiz to Firestore
      const quizDoc = await addDoc(collection(db, "quizzes"), {
        title: quizTitle,
        questions,
        createdBy: {
          uid: user.uid,
          username: userData?.username || "Unknown user",
        },
        code,
        status: "waiting", // waiting, active, completed
        currentQuestion: -1, // -1 means not started
        participants: [],
        createdAt: serverTimestamp(),
      });

      router.push(`/game/lobby/${quizDoc.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while creating the quiz");
      }
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !userData) return null;

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Quiz</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-6">
          <label className="block mb-2">Quiz Title</label>
          <input
            type="text"
            className="w-full p-3 bg-[#1A1A1A] rounded-lg"
            placeholder="Enter quiz title"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
        </div>

        {questions.map((question, qIndex) => (
          <div key={qIndex} className="mb-8 p-6 bg-zinc-900 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Question {qIndex + 1}</h2>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              )}
            </div>

            <div className="mb-4">
              <label className="block mb-2">Question Text</label>
              <input
                type="text"
                className="w-full p-3 bg-[#1A1A1A] rounded-lg"
                placeholder="Enter question"
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "text", e.target.value)
                }
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Time Limit (seconds)</label>
              <input
                type="number"
                min="5"
                max="300"
                className="w-full p-3 bg-[#1A1A1A] rounded-lg"
                value={question.timeLimit}
                onChange={(e) =>
                  handleQuestionChange(qIndex, "timeLimit", parseInt(e.target.value))
                }
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Options (select one correct answer)</label>
              {question.options.map((option, oIndex) => (
                <div key={oIndex} className="flex items-center mb-2">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={option.isCorrect}
                    onChange={() => handleCorrectOptionChange(qIndex, oIndex)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    className="flex-1 p-3 bg-[#1A1A1A] rounded-lg"
                    placeholder={`Option ${oIndex + 1}`}
                    value={option.text}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-between mb-8">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-purple-700 hover:bg-purple-600 px-6 py-3 rounded-lg"
          >
            Add Question
          </button>

          <button
            type="button"
            onClick={createQuiz}
            disabled={isCreating}
            className={`bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg ${
              isCreating ? "opacity-70" : ""
            }`}
          >
            {isCreating ? "Creating..." : "Create Quiz"}
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push("/game")}
            className="px-6 py-2 border border-zinc-700 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
