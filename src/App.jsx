import { Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage";
import Results from "./pages/Results";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}