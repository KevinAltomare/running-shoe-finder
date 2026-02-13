import ShoeCard from "../components/ShoeCard";
import { getRecommendations } from "../logic/recommendationEngine";
import { allShoes } from "../data/loadShoes";
import { useLocation } from "react-router-dom";

export default function Results() {
  const { state } = useLocation();
  
  const user =
    state?.user ||
    JSON.parse(localStorage.getItem("quizUser"));

  if (!user) {
    return (
      <div className="results-container">
        <h1>No quiz data found</h1>
        <p>Please retake the quiz.</p>
      </div>
    );
  }

  const recommendations = getRecommendations(user, allShoes);

  return (
    <div className="results-page">
      <header className="results-header">
        <h1>Your Personalized Running Shoe Matches</h1>
        <p className="results-subtitle">
          Based on your running style, preferences, and injury profile.
        </p>
      </header>

      <div className="results-grid">
        {recommendations.map((item, index) => (
          <ShoeCard
            key={index}
            shoe={item.shoe}
            explanation={item.explanation}
            tagline={item.tagline}
          />
        ))}
      </div>

      <div className="results-footer">
        <button className="retake-button" onClick={() => {
          localStorage.removeItem("quizUser");
          window.location.href = "/";
}}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
}