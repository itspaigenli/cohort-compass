import ScheduleList from "./components/ScheduleList.jsx";

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

      <section className="quick-links" aria-labelledby="quick-links-heading">
        <h2 id="quick-links-heading">Quick Access</h2>

        <div className="quick-link-grid">
          <a href="#schedule">Schedule</a>
          <a href="#links">Important Links</a>
          <a href="#reminders">Reminders</a>
          <a href="#resources">Resources</a>
        </div>
      </section>

      <section
        id="schedule"
        className="schedule-section"
        aria-labelledby="schedule-heading"
      >
        <h2 id="schedule-heading">Upcoming Schedule</h2>
        <ScheduleList />
      </section>
    </main>
  );
}

export default App;
