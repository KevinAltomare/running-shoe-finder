import { Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage";
import Results from "./pages/Results";
import FlatFeet from "./pages/FlatFeet";
import HighArches from "./pages/HighArches";
import ShinSplints from "./pages/ShinSplints";
import WideFeet from "./pages/WideFeet";
import Beginners from "./pages/Beginners";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/results" element={<Results />} />
      <Route path="/best-running-shoes-flat-feet" element={<FlatFeet />} />
      <Route path="/best-running-shoes-high-arches" element={<HighArches />} />
      <Route path="/best-running-shoes-shin-splints" element={<ShinSplints />} />
      <Route path="/best-running-shoes-wide-feet" element={<WideFeet />} />
      <Route path="/best-running-shoes-beginners" element={<Beginners />} />
    </Routes>
  );
}