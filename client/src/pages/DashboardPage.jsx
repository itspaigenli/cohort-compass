import { useState } from "react";
import FaqPreview from "../components/dashboard/FaqPreview.jsx";
import LinksPreview from "../components/dashboard/LinksPreview.jsx";
import MonthlyCalendar from "../components/dashboard/MonthlyCalendar.jsx";
import RemindersPanel from "../components/dashboard/RemindersPanel.jsx";
import SchedulePreview from "../components/dashboard/SchedulePreview.jsx";

function DashboardSection({ id, className, title, children }) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} className={className} aria-labelledby={headingId}>
      <h2 id={headingId}>{title}</h2>
      {children}
    </section>
  );
}

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
    <div className="dashboard-page">
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

      <nav className="section-nav" aria-label="Main sections">
        <a href="#search">Search student hub</a>
        <a href="#schedule">Schedule</a>
        <a href="#links">Links</a>
        <a href="#faq">FAQ</a>
        <a href="#reminders">Reminders</a>
      </nav>

      <section className="quick-find" aria-labelledby="quick-find-heading">
        <p className="eyebrow">Find what you need</p>
        <h2 id="quick-find-heading">What are you looking for?</h2>
        <div className="quick-find-links">
          <a href="#search">Search all resources</a>
          <a href="#schedule">Today&apos;s schedule</a>
          <a href="#links">Program links</a>
          <a href="#faq">Debugging help</a>
          <a href="#reminders">My reminders</a>
        </div>
      </section>

      <div className="dashboard-grid">
        <DashboardSection
          id="schedule"
          className="schedule-section dashboard-section-wide"
          title="Upcoming Schedule"
        >
          <MonthlyCalendar
            year={currentDate.getFullYear()}
            monthIndex={currentDate.getMonth()}
            scheduleItems={scheduleItems}
          />
          <SchedulePreview onScheduleItemsLoaded={setScheduleItems} />
        </DashboardSection>

        <DashboardSection
          id="links"
          className="links-section"
          title="Important Links"
        >
          <LinksPreview />
        </DashboardSection>

        <DashboardSection
          id="faq"
          className="faq-section"
          title="Debugging FAQ"
        >
          <FaqPreview />
        </DashboardSection>

        <DashboardSection
          id="reminders"
          className="reminders-section dashboard-section-wide"
          title="Reminders"
        >
          <RemindersPanel />
        </DashboardSection>
      </div>
    </div>
  );
}
