import { useState } from "react";
import MonthlyCalendar from "../components/dashboard/MonthlyCalendar.jsx";
import RemindersPanel from "../components/dashboard/RemindersPanel.jsx";
import SchedulePreview from "../components/dashboard/SchedulePreview.jsx";

export default function DashboardPage() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const currentDate = new Date();

  function handleHeroSearch(event) {
    event.preventDefault();

    const trimmedSearchQuery = searchQuery.trim();

    if (trimmedSearchQuery) {
      sessionStorage.setItem("cohort-compass-search-query", trimmedSearchQuery);
    }

    window.location.hash = "#search";
  }

  return (
    <div className="dashboard-page compass-home">
      <header className="hero dashboard-hero">
        <p className="eyebrow">Techtonica student hub</p>
        <h1>Cohort Compass</h1>
        <p>
          Search curriculum, documentation, debugging support, and program
          resources in one place.
        </p>
        <form className="hero-search-form" onSubmit={handleHeroSearch}>
          <label className="sr-only" htmlFor="dashboard-search">
            Search docs, tools, debugging help, or a topic
          </label>
          <input
            id="dashboard-search"
            type="search"
            placeholder="Search docs, tools, debugging help, or a topic"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <button type="submit">Search student hub</button>
        </form>
        <div className="hero-actions">
          <a className="secondary-action" href="#faq">
            Open debugging FAQ
          </a>
        </div>
      </header>

      <section className="compass-focus-band" aria-label="Today at a glance">
        <div className="compass-focus-grid">
          <SchedulePreview onScheduleItemsLoaded={setScheduleItems} />
          <section
            id="dashboard-reminders"
            className="reminders-section"
            aria-labelledby="dashboard-reminders-heading"
          >
            <h2 id="dashboard-reminders-heading">Reminder list</h2>
            <RemindersPanel />
          </section>
        </div>
      </section>

      <section
        id="schedule"
        className="compass-calendar-band"
        aria-labelledby="calendar-band-heading"
      >
        <div className="compass-calendar-band-header">
          <h2 id="calendar-band-heading">Plan your week</h2>
        </div>
        <MonthlyCalendar
          year={currentDate.getFullYear()}
          monthIndex={currentDate.getMonth()}
          scheduleItems={scheduleItems}
        />
      </section>
    </div>
  );
}
