import FaqPreview from "./components/dashboard/FaqPreview.jsx";
import LinksPreview from "./components/dashboard/LinksPreview.jsx";
import RemindersPanel from "./components/dashboard/RemindersPanel.jsx";
import SchedulePreview from "./components/dashboard/SchedulePreview.jsx";

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

      <nav className="section-nav" aria-label="Main sections">
        <a href="#schedule">Schedule</a>
        <a href="#links">Links</a>
        <a href="#faq">FAQ</a>
        <a href="#reminders">Reminders</a>
      </nav>

      <section
        id="schedule"
        className="schedule-section"
        aria-labelledby="schedule-heading"
      >
        <h2 id="schedule-heading">Upcoming Schedule</h2>
        <SchedulePreview />
      </section>

      <section
        id="links"
        className="links-section"
        aria-labelledby="links-heading"
      >
        <h2 id="links-heading">Important Links</h2>
        <LinksPreview />
      </section>

      <section id="faq" className="faq-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Debugging FAQ</h2>
        <FaqPreview />
      </section>

      <section
        id="reminders"
        className="reminders-section"
        aria-labelledby="reminders-heading"
      >
        <h2 id="reminders-heading">Reminders</h2>
        <RemindersPanel />
      </section>
    </main>
  );
}

export default App;
