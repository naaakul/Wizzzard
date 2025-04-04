import QuizControl from "../../../../components/QuizControl";

export default function QuizControlPage({
  params,
}: {
  params: { quizId: string };
}) {
  return <QuizControl quizId={params.quizId} />;
}
