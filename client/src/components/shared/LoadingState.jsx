export default function LoadingState({ label = "Loading Cohort Compass..." }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-dot" />
      <p>{label}</p>
    </div>
  );
}
