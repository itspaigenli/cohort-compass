import { useState } from "react";
import { formatScheduleDateRange, parseCalendarDate } from "../../utils/dateTime.js";

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

function getLocationLabel(location = "") {
  if (!location) {
    return "";
  }

  if (/^https?:\/\//i.test(location)) {
    return location.includes("zoom.us") ? "Zoom" : "Virtual meeting";
  }

  return location;
}

function ScheduleDay({ date, items, today }) {
  return (
    <section className="schedule-day">
      <div className="schedule-day-header">
        <h3>{getDayHeading(date, today)}</h3>
      </div>
      {items.length ? (
        <ul className="schedule-list">
          {items.map((item) => (
            <li key={item.id} className="mini-card schedule-card">
              <p className="item-meta">
                {item.date_and_duration_string ||
                  formatScheduleDateRange(item.start_time, item.end_time)}
              </p>
              <h3>{item.title}</h3>
              {item.location ? (
                <p className="item-meta">{getLocationLabel(item.location)}</p>
              ) : null}
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

export default function SchedulePreview({
  scheduleItems = [],
  today = new Date(),
  className = "",
}) {
  const [anchorDay, setAnchorDay] = useState(today);
  const nextDay = addDays(anchorDay, 1);
  const anchorItems = getItemsForDay(scheduleItems, anchorDay);
  const nextDayItems = getItemsForDay(scheduleItems, nextDay);

  function moveAnchorDay(dayCount) {
    setAnchorDay((currentDate) => addDays(currentDate, dayCount));
  }

  return (
    <section className={`schedule-section schedule-preview ${className}`.trim()}>
      <div className="panel-header">
        <h2>Two-day snapshot</h2>
        <div className="schedule-nav">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous days"
            onClick={() => moveAnchorDay(-2)}
          >
            ←
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next days"
            onClick={() => moveAnchorDay(2)}
          >
            →
          </button>
        </div>
      </div>
      <div className="schedule-columns">
        <ScheduleDay date={anchorDay} items={anchorItems} today={today} />
        <ScheduleDay date={nextDay} items={nextDayItems} today={today} />
      </div>
    </section>
  );
}
