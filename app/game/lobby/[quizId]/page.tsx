// app/game/lobby/[quizId]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";

interface QuizParticipant {
  uid: string;
  username: string;
  score: number;
}

interface QuizData {
  id: string;
  title: string;
  code: string;
  status: "waiting" | "active" | "completed";
  currentQuestion: number;
  questions: any[];
  participants: QuizParticipant[];
  createdBy: {
    uid: string;
    username: string;
  };
}

const QuizLobby = ({ params }: { params: { quizId: string } }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [error, setError] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  // Subscribe to quiz updates
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, "quizzes", params.quizId),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data() as Omit<QuizData, "id">;
          setQuiz({ ...data, id: doc.id });
          
          // If quiz is active and you are the creator, go to control page
          if (data.status === "active" && data.createdBy.uid === user.uid) {
            router.push(`/game/control/${params.quizId}`);
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
  }, [params.quizId, user, router]);

  // Check if user is the creator
  useEffect(() => {
    if (!quiz || !user) return;

    if (quiz.createdBy.uid !== user.uid) {
      router.push(`/game/join/${params.quizId}`);
    }
  }, [quiz, user, params.quizId, router]);

  const startQuiz = async () => {
    if (!quiz || !user) return;
    if (quiz.participants.length === 0) {
      setError("You need at least one participant to start the quiz");
      return;
    }

    setIsStarting(true);
    setError("");

    try {
      await updateDoc(doc(db, "quizzes", params.quizId), {
        status: "active",
        currentQuestion: 0,
      });
      
      // Navigation to control page will happen automatically due to the onSnapshot
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while starting the quiz");
      }
      setIsStarting(false);
    }
  };

  if (loading || !quiz) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{quiz.title}</h1>
          <div className="bg-zinc-800 py-2 px-4 rounded-lg">
            <p className="text-sm">Quiz Code</p>
            <p className="text-2xl font-bold tracking-wider">{quiz.code}</p>
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Participants ({quiz.participants.length})</h2>
            <p className="text-zinc-400">Waiting for players to join...</p>
          </div>

          {quiz.participants.length > 0 ? (
            <div className="bg-zinc-900 rounded-lg p-4">
              {quiz.participants.map((participant) => (
                <div
                  key={participant.uid}
                  className="flex items-center py-2 border-b border-zinc-800 last:border-0"
                >
                  <p className="font-medium">{participant.username}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900 rounded-lg p-8 text-center">
              <p className="text-zinc-500">No participants have joined yet</p>
              <p className="text-zinc-500 text-sm mt-2">
                Share the quiz code with others to let them join
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={startQuiz}
            disabled={isStarting || quiz.participants.length === 0}
            className={`bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg ${
              isStarting || quiz.participants.length === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isStarting ? "Starting..." : "Start Quiz"}
          </button>

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

export default QuizLobby;