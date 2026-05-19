import { useState } from "react";
import MonthlyCalendar from "../components/dashboard/MonthlyCalendar.jsx";
import RemindersPanel from "../components/dashboard/RemindersPanel.jsx";
import SchedulePreview from "../components/dashboard/SchedulePreview.jsx";
import HeroSearchSection from "../components/shared/HeroSearchSection.jsx";
import heroBackground from "../assets/techtonica-hero-perplexity-cat.png";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function DashboardPage({
  reminders = [],
  onRemindersChange,
  scheduleItems,
  onLoadScheduleItems,
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="page-stack compass-home perplexity-inspired-home">
      <HeroSearchSection
        title="Cohort Compass"
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={onSearch}
        backgroundSrc={heroBackground}
        secondaryActionLabel="Open debugging FAQ"
        secondaryActionHref="#faq"
      />

      <section className="compass-focus-band">
        <div className="compass-focus-grid">
          <SchedulePreview
            items={scheduleItems}
            onLoadItemsForDate={onLoadScheduleItems}
            className="compass-snapshot-surface"
          />
          <RemindersPanel
            reminders={reminders}
            onRemindersChange={onRemindersChange}
            className="compass-reminders-surface"
          />
        </div>
      </section>

      <section className="compass-calendar-band">
        <div className="compass-calendar-band-header">
          <div>
            <h2>Plan your week</h2>
          </div>
        </div>

        <div className="compass-calendar-grid compass-calendar-grid-full">
          <MonthlyCalendar
            items={scheduleItems}
            reminders={reminders}
            onLoadItemsForDate={onLoadScheduleItems}
            className="compass-calendar-surface"
            remindersHref="#dashboard-reminders"
          />
        </div>
      </section>

      <button
        className="search-back-to-top"
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
      >
        <i className="fa-solid fa-circle-arrow-up" aria-hidden="true" />
      </button>
    </div>
  );
}
