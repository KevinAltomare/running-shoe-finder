import { useState } from "react";
import { quizData } from "./quizData";
import Question from "./Question";
import ProgressBar from "./ProgressBar";

export default function Quiz({ onComplete }) {
  
  const [showStart, setShowStart] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});

  const current = quizData[step];

  
  if (showStart) {
    return (
     <div className="quiz-start-wrapper">
       
      <div className="brand-header">
        <h1 className="brand-title">RunMatch</h1>
        <p className="brand-tagline">the running shoe finder</p>
      </div>



      <div className="quiz-start-card">
        
        <h1>Find Your Perfect Running Shoe</h1>

        <p className="start-subtext">
          A quick, beginner‑friendly quiz to help you choose the right pair with confidence.
        </p>

        <button
          className="start-button"
          onClick={() => setShowStart(false)}
        >
          Start Quiz
        </button>

        <p className="start-footer">
          Takes less than 60 seconds. No experience needed.
        </p>
      </div>
    </div>
  );
}

 

  
  function handleAnswer(value) {
    const updated = { ...answers, [current.id]: value };
    setAnswers(updated);

    if (step < quizData.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(updated);
    }
  }

  
  return (
    <div className="quiz-page">
      <div className="quiz-card">

        <div className="progress-text">
          Question {step + 1} of {quizData.length}
        </div>

        <ProgressBar step={step} total={quizData.length} />

        <div key={step} className="fade quiz-section">
          <Question data={current} onSelect={handleAnswer} />
        </div>

        {step > 0 && (
          <button className="back-button" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}

      </div>
    </div>
  );
}