// // app/game/control/[quizId]/page.tsx
// "use client";

// import React, { useState, useEffect } from "react";
// import { useAuth } from "@/firebase/auth";
// import { useRouter } from "next/navigation";
// import { db } from "@/firebase/config";
// import { doc, onSnapshot, updateDoc } from "firebase/firestore";

// interface QuizQuestion {
//   text: string;
//   timeLimit: number;
//   options: {
//     text: string;
//     isCorrect: boolean;
//   }[];
// }

// interface QuizParticipant {
//   uid: string;
//   username: string;
//   score: number;
//   answers?: {
//     questionIndex: number;
//     selectedOption: number;
//     isCorrect: boolean;
//     timeTaken: number;
//   }[];
// }

// interface QuizData {
//   id: string;
//   title: string;
//   status: "waiting" | "active" | "completed";
//   currentQuestion: number;
//   questions: QuizQuestion[];
//   participants: QuizParticipant[];
//   createdBy: {
//     uid: string;
//     username: string;
//   };
// }

// const QuizControl = ({ params }: { params: { quizId: string } }) => {
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [quiz, setQuiz] = useState<QuizData | null>(null);
//   const [error, setError] = useState("");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState<number | null>(null);
//   const [questionActive, setQuestionActive] = useState(false);

//   // Redirect if not logged in
//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/auth/signin");
//     }
//   }, [user, loading, router]);

//   // Subscribe to quiz updates
//   useEffect(() => {
//     if (!user) return;

//     const unsubscribe = onSnapshot(
//       doc(db, "quizzes", params.quizId),
//       (doc) => {
//         if (doc.exists()) {
//           const data = doc.data() as Om