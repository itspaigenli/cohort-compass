import SchedulePreview from "./components/SchedulePreview.jsx";

function App() {
  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Student dashboard</p>
        <h1>Cohort Compass</h1>
        <p>
          A simple place to check your cohort schedule, important links,
          reminders, and class resources.
        </p>
      </header>

      <section
        id="schedule"
        className="schedule-section"
        aria-labelledby="schedule-heading"
      >
        <h2 id="schedule-heading">Upcoming Schedule</h2>
        <SchedulePreview />
      </section>
    </main>
  );
}

export default App;
