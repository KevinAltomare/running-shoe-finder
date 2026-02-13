export default function Question({ data, onSelect }) {
  return (
    <div className="question-wrapper">
      <h2 className="question-text">{data.question}</h2>

      <div className="options-grid">
        {data.options.map(opt => (
          <button
            key={opt.value}
            className="answer-option"
            onClick={() => onSelect(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}