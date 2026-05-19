import { parseCalendarDate } from "../../utils/dateTime.js";

function addDays(date, dayCount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + dayCount);

  return nextDate;
}

function getDayHeading(date, today) {
  const dayLabel = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  if (date.toDateString() === today.toDateString()) {
    return `Today · ${dayLabel}`;
  }

  if (date.toDateString() === addDays(today, 1).toDateString()) {
    return `Tomorrow · ${dayLabel}`;
  }

  return dayLabel;
}

function getItemsForDay(items, date) {
  return items.filter((item) => {
    const itemDate = parseCalendarDate(item.start_time);

    return itemDate.toDateString() === date.toDateString();
  });
}

function ScheduleDay({ date, items, today }) {
  return (
    <section className="schedule-day">
      <h3>{getDayHeading(date, today)}</h3>
      {items.length ? (
        <ul className="schedule-list">
          {items.map((item) => (
            <li key={item.id} className="schedule-card">
              <p className="item-meta">{item.date_and_duration_string}</p>
              <h4>{item.title}</h4>
              {item.location ? <p>{item.location}</p> : null}
              {item.meeting_url ? (
                <a href={item.meeting_url} target="_blank" rel="noreferrer">
                  View in Google Calendar
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty-state">No events on this day&apos;s calendar.</p>
      )}
    </section>
  );
}

export default function SchedulePreview({ scheduleItems = [], today = new Date() }) {
  const tomorrow = addDays(today, 1);
  const todayItems = getItemsForDay(scheduleItems, today);
  const tomorrowItems = getItemsForDay(scheduleItems, tomorrow);
  const hasGoogleCalendarItems = scheduleItems.some((item) => {
    return item.source === "google-calendar";
  });

  return (
    <section className="schedule-section schedule-preview">
      <div className="panel-header">
        <h2>Two-day snapshot</h2>
        <p className="schedule-source-note">
          {hasGoogleCalendarItems
            ? "Showing events from Google Calendar."
            : "Showing saved schedule items."}
        </p>
      </div>
      <div className="schedule-columns">
        <ScheduleDay date={today} items={todayItems} today={today} />
        <ScheduleDay date={tomorrow} items={tomorrowItems} today={today} />
      </div>
    </section>
  );
}
