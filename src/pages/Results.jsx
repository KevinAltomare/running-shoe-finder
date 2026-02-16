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
          window.location.href = "/";}}>
          Retake Quiz
        </button>
         <p className="affiliate-disclaimer">
    This site uses affiliate links. We may earn a commission if you buy through these links, at no extra cost to you.
  </p>


      </div>

      <h2 className="related-heading">Related Guides</h2>
<ul className="related-guides">
  <li><a href="/best-running-shoes-beginners">Best Shoes for Beginners</a></li>
  <li><a href="/best-running-shoes-flat-feet">Best Shoes for Flat Feet</a></li>
  <li><a href="/best-running-shoes-high-arches">Best Shoes for High Arches</a></li>
  <li><a href="/best-running-shoes-shin-splints">Best Shoes for Shin Splints</a></li>
  <li><a href="/best-running-shoes-wide-feet">Best Shoes for Wide Feet</a></li>
</ul>
    </div>
  );
}