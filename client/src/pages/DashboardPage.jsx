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
    <div className="page-stack dashboard-page compass-home perplexity-inspired-home">
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
          <SchedulePreview
            scheduleItems={scheduleItems}
            className="compass-snapshot-surface"
          />
          <RemindersPanel
            reminders={reminders}
            onRemindersChange={onRemindersChange}
            className="compass-reminders-surface"
          />
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
          scheduleItems={scheduleItems}
          reminders={reminders}
          today={currentDate}
        />
      </section>
    </div>
  );
}
