import { useMemo, useState } from "react";
import { parseCalendarDate } from "../../utils/dateTime.js";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateKeyFromValue(value) {
  if (typeof value === "string" && value.length >= 10) {
    return value.slice(0, 10);
  }

  return getDateKey(parseCalendarDate(value));
}

function buildCalendarDays(monthDate) {
  const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const firstGridDay = new Date(firstDayOfMonth);
  firstGridDay.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(firstGridDay);
    day.setDate(firstGridDay.getDate() + index);
    return day;
  });
}

function getGoogleCalendarDayUrl(dateKey) {
  const [year, month, day] = dateKey.split("-");

  return `https://calendar.google.com/calendar/u/0/r/day/${year}/${Number(month)}/${Number(day)}`;
}

function groupScheduleItemsByDay(scheduleItems) {
  return scheduleItems.reduce((itemsByDay, item) => {
    const dateKey = getDateKeyFromValue(item.start_time);

    return {
      ...itemsByDay,
      [dateKey]: [...(itemsByDay[dateKey] || []), item],
    };
  }, {});
}

function groupRemindersByDay(reminders) {
  return reminders.reduce((remindersByDay, reminder) => {
    if (!reminder.due_at) {
      return remindersByDay;
    }

    const dateKey = getDateKeyFromValue(reminder.due_at);

    return {
      ...remindersByDay,
      [dateKey]: [...(remindersByDay[dateKey] || []), reminder],
    };
  }, {});
}

function formatMonthLabel(date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatSelectedDay(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function MonthlyCalendar({
  scheduleItems = [],
  reminders = [],
  today = new Date(),
}) {
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [selectedDateKey, setSelectedDateKey] = useState(() => getDateKey(today));
  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );
  const scheduleItemsByDay = useMemo(
    () => groupScheduleItemsByDay(scheduleItems),
    [scheduleItems],
  );
  const remindersByDay = useMemo(
    () => groupRemindersByDay(reminders),
    [reminders],
  );
  const selectedDay =
    calendarDays.find((day) => getDateKey(day) === selectedDateKey) || today;
  const selectedDayEvents = scheduleItemsByDay[selectedDateKey] || [];
  const selectedDayReminders = remindersByDay[selectedDateKey] || [];

  function showPreviousMonth() {
    setVisibleMonth((currentMonth) => {
      return new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    });
  }

  function showNextMonth() {
    setVisibleMonth((currentMonth) => {
      return new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    });
  }

  return (
    <section className="month-calendar-panel" aria-labelledby="month-calendar-heading">
      <div className="panel-header">
        <h3 id="month-calendar-heading">Monthly schedule calendar</h3>
        <div className="schedule-nav">
          <button type="button" className="icon-button" onClick={showPreviousMonth}>
            ←
          </button>
          <p className="month-calendar-label">{formatMonthLabel(visibleMonth)}</p>
          <button type="button" className="icon-button" onClick={showNextMonth}>
            →
          </button>
        </div>
      </div>

      <div className="month-calendar-grid" role="grid" aria-label="Monthly schedule calendar">
        {weekdayLabels.map((label) => (
          <span key={label} className="month-calendar-weekday" role="columnheader">
            {label}
          </span>
        ))}

        {calendarDays.map((day) => {
          const dateKey = getDateKey(day);
          const dayEvents = scheduleItemsByDay[dateKey] || [];
          const dayReminders = remindersByDay[dateKey] || [];
          const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
          const isToday = dateKey === getDateKey(today);
          const isSelected = dateKey === selectedDateKey;

          return (
            <button
              type="button"
              key={dateKey}
              className={`month-calendar-day${isCurrentMonth ? "" : " outside-month"}${isToday ? " today" : ""}${isSelected ? " selected" : ""}`}
              aria-pressed={isSelected}
              onClick={() => setSelectedDateKey(dateKey)}
            >
              <span className="month-calendar-date">{day.getDate()}</span>
              {dayEvents.length ? (
                <span className="month-calendar-count">
                  {dayEvents.length} event{dayEvents.length === 1 ? "" : "s"}
                </span>
              ) : null}
              {dayReminders.length ? (
                <span className="month-calendar-reminders">
                  {dayReminders.length} reminder{dayReminders.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="month-calendar-detail">
        <h3>{formatSelectedDay(selectedDay)}</h3>
        {selectedDayEvents.length || selectedDayReminders.length ? (
          <div className="month-calendar-detail-list">
            {selectedDayEvents.map((item) => (
              <a
                key={item.id}
                className="month-calendar-detail-item"
                href={item.meeting_url || getGoogleCalendarDayUrl(selectedDateKey)}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{item.title}</strong>
                <span>{item.date_and_duration_string}</span>
              </a>
            ))}
            {selectedDayReminders.map((reminder) => (
              <a
                key={reminder.id}
                className="month-calendar-detail-item"
                href="#dashboard-reminders"
              >
                <strong>{reminder.text}</strong>
                <span>{reminder.done ? "Done" : "Reminder"}</span>
              </a>
            ))}
          </div>
        ) : (
          <p className="empty-state">No events or reminders for this day.</p>
        )}
      </div>
    </section>
  );
}
