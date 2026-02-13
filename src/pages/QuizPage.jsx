import { useNavigate } from "react-router-dom";
import Quiz from "../quiz/Quiz";

export default function QuizPage() {
  const navigate = useNavigate();

  return (
    <Quiz
     onComplete={(answers) => {
        console.log("QUIZ FINISHED — ANSWERS:", answers);
        localStorage.setItem("quizUser", JSON.stringify(answers));
        
        navigate("/results");
}}
    />
  );
}