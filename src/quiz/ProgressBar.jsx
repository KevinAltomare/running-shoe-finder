export default function ProgressBar({ step, total }) {
  const percent = ((step + 1) / total) * 100;

  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${percent}%` }} />
    </div>
  );
}