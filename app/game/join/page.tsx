// app/game/join/page.tsx
"use client";

import React, { useState } from "react";
import { useAuth } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { db } from "@/firebase/config";
import { collection, query, where, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";

const JoinQuiz = () => {
  const { user, userData, loading } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  // Redirect if not logged in
  React.useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin");
    }
  }, [user, loading, router]);

  const handleJoin = async () => {
    if (!code.trim()) {
      setError("Please enter a quiz code");
      return;
    }

    if (!user || !userData) {
      setError("You must be logged in to join a quiz");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      // Find quiz by code
      const quizzesRef = collection(db, "quizzes");
      const q = query(quizzesRef, where("code", "==", code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError("No quiz found with this code");
        return;
      }

      // Get the first quiz
      const quizDoc = querySnapshot.docs[0];
      const quizData = quizDoc.data();

      // Check if quiz is still accepting participants
      if (quizData.status !== "waiting") {
        setError("This quiz has already started or ended");
        return;
      }

      // Check if user is already a participant
      const existingParticipant = (quizData.participants || []).find(
        (p: any) => p.uid === user.uid
      );

      if (!existingParticipant) {
        // Add user as participant
        await updateDoc(doc(db, "quizzes", quizDoc.id), {
          participants: arrayUnion({
            uid: user.uid,
            username: userData.username,
            score: 0,
          }),
        });
      }

      // Redirect to lobby
      router.push(`/game/join/${quizDoc.id}`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred while joining the quiz");
      }
    } finally {
      setIsJoining(false);
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
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <div className="w-full max-w-md flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold">Join a Quiz</h1>
        
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="w-full">
          <label className="block mb-2">Enter Quiz Code</label>
          <input
            type="text"
            className="w-full p-4 bg-[#1A1A1A] rounded-lg text-center text-2xl tracking-wider"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
        </div>
        
        <button
          className={`w-full py-3 text-center bg-white rounded-lg ${
            isJoining ? "opacity-70" : ""
          }`}
          onClick={handleJoin}
          disabled={isJoining}
        >
          <p className="font-medium text-[#252328]">
            {isJoining ? "Joining..." : "Join Quiz"}
          </p>
        </button>
        
        <button
          onClick={() => router.push("/game")}
          className="px-6 py-2 border border-zinc-700 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default JoinQuiz;