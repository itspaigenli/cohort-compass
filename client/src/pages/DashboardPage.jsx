import { useState } from "react";
import MonthlyCalendar from "../components/dashboard/MonthlyCalendar.jsx";
import RemindersPanel from "../components/dashboard/RemindersPanel.jsx";
import SchedulePreview from "../components/dashboard/SchedulePreview.jsx";
import HeroSearchSection from "../components/shared/HeroSearchSection.jsx";
import heroBackground from "../assets/techtonica-hero-perplexity-cat.png";

export default function DashboardPage({
  reminders = [],
  onRemindersChange,
  scheduleItems = [],
  onSearch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const currentDate = new Date();

  return (
    <div className="dashboard-page compass-home">
      <HeroSearchSection
        title="Cohort Compass"
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearch={onSearch}
        backgroundSrc={heroBackground}
        secondaryActionLabel="Open debugging FAQ"
        secondaryActionHref="#faq"
      />

      <section className="compass-focus-band" aria-label="Today at a glance">
        <div className="compass-focus-grid">
          <SchedulePreview scheduleItems={scheduleItems} />
          <section
            id="dashboard-reminders"
            className="reminders-section"
            aria-labelledby="dashboard-reminders-heading"
          >
            <h2 id="dashboard-reminders-heading">Reminder list</h2>
            <RemindersPanel
              reminders={reminders}
              onRemindersChange={onRemindersChange}
            />
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
