import { useEffect, useMemo, useState } from "react";
import {
  formatMobileDetailDate,
  formatMonthYear,
  formatOptionalTime,
  formatTimeRange,
  isSameCalendarDay,
  normalizeScheduleItems,
  parseCalendarDate,
  startOfLocalDay,
  toDateKey,
  toDateKeyInTimeZone,
} from "../../utils/dateTime.js";

function buildCalendarDays(monthDate) {
  const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startOffset = firstDayOfMonth.getDay();
  const gridStart = new Date(firstDayOfMonth);
  gridStart.setDate(firstDayOfMonth.getDate() - startOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + index);
    return day;
  });
}

function getGoogleCalendarDayUrl(dateKey) {
  const [year, month, day] = dateKey.split("-");
  return `https://calendar.google.com/calendar/u/0/r/day/${year}/${Number(month)}/${Number(day)}`;
}

function getReminderPreview(reminders = []) {
  if (!reminders.length) {
    return "";
  }

  const [firstReminder] = reminders;
  const firstText = String(firstReminder?.text || "").trim();

  if (!firstText) {
    return reminders.length === 1
      ? "Reminder"
      : `Reminder +${reminders.length - 1} more`;
  }

  return reminders.length === 1 ? firstText : `${firstText} +${reminders.length - 1} more`;
}

function getIsCompactViewport() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(max-width: 640px)").matches;
}

export default function MonthlyCalendar({
  items,
  reminders = [],
  onLoadItemsForDate,
  className = "",
  remindersHref = "#dashboard-reminders",
}) {
  const today = useMemo(() => startOfLocalDay(new Date()), []);
  const normalizedItems = useMemo(() => normalizeScheduleItems(items), [items]);
  const [visibleMonth, setVisibleMonth] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [isCompactViewport, setIsCompactViewport] = useState(getIsCompactViewport);
  const [selectedDateKey, setSelectedDateKey] = useState(() => toDateKey(today));

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const itemsByDay = useMemo(
    () =>
      normalizedItems.reduce((collection, item) => {
        const dateKey = item.start_date_key || toDateKeyInTimeZone(item.start_time);
        return {
          ...collection,
          [dateKey]: [...(collection[dateKey] || []), item],
        };
      }, {}),
    [normalizedItems],
  );
  const remindersByDay = useMemo(
    () =>
      reminders.reduce((collection, reminder) => {
        if (!reminder?.due_at) {
          return collection;
        }

        const parsedDueDate = parseCalendarDate(reminder.due_at);

        if (Number.isNaN(parsedDueDate.getTime())) {
          return collection;
        }

        const dateKey = toDateKeyInTimeZone(reminder.due_at);
        return {
          ...collection,
          [dateKey]: [...(collection[dateKey] || []), reminder],
        };
      }, {}),
    [reminders],
  );
  const visibleMonthLabel = formatMonthYear(visibleMonth);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const handleChange = (event) => setIsCompactViewport(event.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const currentMonthDayKeys = useMemo(() => {
    const currentMonthDays = calendarDays.filter((day) => day.getMonth() === visibleMonth.getMonth());
    return new Set(currentMonthDays.map((day) => toDateKey(day)));
  }, [calendarDays, visibleMonth]);

  const activeSelectedDateKey = useMemo(() => {
    if (currentMonthDayKeys.has(selectedDateKey)) {
      return selectedDateKey;
    }

    const todayKey = toDateKey(today);

    if (currentMonthDayKeys.has(todayKey)) {
      return todayKey;
    }

    const firstCurrentMonthDay = calendarDays.find((day) => day.getMonth() === visibleMonth.getMonth());
    return firstCurrentMonthDay ? toDateKey(firstCurrentMonthDay) : toDateKey(visibleMonth);
  }, [calendarDays, currentMonthDayKeys, selectedDateKey, today, visibleMonth]);

  const selectedDayData = useMemo(() => {
    const selectedDay = calendarDays.find((day) => toDateKey(day) === activeSelectedDateKey) || calendarDays[0];

    if (!selectedDay) {
      return null;
    }

    const dateKey = toDateKey(selectedDay);

    return {
      day: selectedDay,
      dateKey,
      items: itemsByDay[dateKey] || [],
      reminders: remindersByDay[dateKey] || [],
    };
  }, [activeSelectedDateKey, calendarDays, itemsByDay, remindersByDay]);

  async function handleEventCountHover(dateKey) {
    if (!onLoadItemsForDate) {
      return;
    }

    await onLoadItemsForDate({ date: dateKey });
  }

  return (
    <section className={`panel month-calendar-panel ${className}`.trim()}>
      <div className="panel-header">
        <div />
        <div className="schedule-nav">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous month"
            onClick={() =>
              setVisibleMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() - 1, 1),
              )
            }
          >
            <i className="fa-solid fa-circle-arrow-left" aria-hidden="true" />
          </button>
          <p className="month-calendar-label">{visibleMonthLabel}</p>
          <button
            type="button"
            className="icon-button"
            aria-label="Next month"
            onClick={() =>
              setVisibleMonth(
                (current) => new Date(current.getFullYear(), current.getMonth() + 1, 1),
              )
            }
          >
            <i className="fa-solid fa-circle-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="month-calendar-scroll">
        <div className="month-calendar-grid" role="grid" aria-label="Monthly schedule calendar">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
            <div key={label} className="month-calendar-weekday" role="columnheader">
              {label}
            </div>
          ))}

          {calendarDays.map((day) => {
            const dateKey = toDateKey(day);
            const dayItems = itemsByDay[dateKey] || [];
            const dayReminders = remindersByDay[dateKey] || [];
            const allDayRemindersDone = dayReminders.length > 0 && dayReminders.every((reminder) => reminder.done);
            const isCurrentMonth = day.getMonth() === visibleMonth.getMonth();
            const isToday = isSameCalendarDay(day, today);
            const isSelected = dateKey === activeSelectedDateKey;

            return (
              <button
                type="button"
                key={dateKey}
                className={`month-calendar-day${isCurrentMonth ? "" : " outside-month"}${isToday ? " today" : ""}${isCompactViewport ? " compact" : ""}${isSelected ? " selected" : ""}`}
                aria-pressed={isCompactViewport ? isSelected : undefined}
                onClick={() => {
                  if (isCompactViewport) {
                    setSelectedDateKey(dateKey);
                    return;
                  }
                }}
              >
                <span className="month-calendar-date">{day.getDate()}</span>
                {isCompactViewport ? (
                  <div className="month-calendar-dots" aria-label={`Calendar indicators for ${dateKey}`}>
                    {dayItems.length ? (
                      <span
                        className="month-calendar-dot month-calendar-dot-event"
                        title={`${dayItems.length} event${dayItems.length === 1 ? "" : "s"}`}
                        aria-label={`${dayItems.length} event${dayItems.length === 1 ? "" : "s"} on ${dateKey}`}
                      />
                    ) : null}
                    {dayReminders.length ? (
                      <span
                        className={`month-calendar-dot month-calendar-dot-reminder${allDayRemindersDone ? " done" : ""}`}
                        title={dayReminders.map((reminder) => reminder.text).filter(Boolean).join("\n")}
                        aria-label={`${dayReminders.length} reminder${dayReminders.length === 1 ? "" : "s"} on ${dateKey}`}
                      />
                    ) : null}
                  </div>
                ) : (
                  <>
                    {dayItems.length ? (
                      <a
                        className="month-calendar-count"
                        href={getGoogleCalendarDayUrl(dateKey)}
                        target="_blank"
                        rel="noreferrer"
                        onMouseEnter={() => handleEventCountHover(dateKey)}
                        onFocus={() => handleEventCountHover(dateKey)}
                      >
                        {dayItems.length} event{dayItems.length === 1 ? "" : "s"}
                      </a>
                    ) : null}
                    {dayReminders.length ? (
                      <span
                        className={`month-calendar-reminders${allDayRemindersDone ? " done" : ""}`}
                        title={dayReminders.map((reminder) => reminder.text).filter(Boolean).join("\n")}
                      >
                        {getReminderPreview(dayReminders)}
                      </span>
                    ) : null}
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {isCompactViewport && selectedDayData ? (
        <div className="month-calendar-mobile-detail">
          <div className="month-calendar-mobile-detail-header">
            <h3>{formatMobileDetailDate(selectedDayData.day)}</h3>
          </div>

          {selectedDayData.items.length || selectedDayData.reminders.length ? (
            <div className="month-calendar-mobile-detail-body">
              {selectedDayData.items.length ? (
                <div className="month-calendar-mobile-detail-group">
                  {selectedDayData.items.map((item) => (
                    <a
                      key={item.id}
                      className="month-calendar-mobile-detail-item"
                      href={getGoogleCalendarDayUrl(selectedDayData.dateKey)}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => handleEventCountHover(selectedDayData.dateKey)}
                      onFocus={() => handleEventCountHover(selectedDayData.dateKey)}
                    >
                      <span className="month-calendar-mobile-detail-dot month-calendar-mobile-detail-dot-event" />
                      <span className="month-calendar-mobile-detail-copy">
                        <strong>{item.title}</strong>
                        <span>{item.time_range_string || formatTimeRange(item.start_time, item.end_time)}</span>
                      </span>
                    </a>
                  ))}
                </div>
              ) : null}

              {selectedDayData.reminders.length ? (
                <div className="month-calendar-mobile-detail-group">
                  {selectedDayData.reminders.map((reminder) => (
                    <a
                      key={reminder.id}
                      className={`month-calendar-mobile-detail-item month-calendar-mobile-detail-reminder${reminder.done ? " done" : ""}`}
                      href={remindersHref}
                    >
                      <span className="month-calendar-mobile-detail-dot month-calendar-mobile-detail-dot-reminder" />
                      <span className="month-calendar-mobile-detail-copy">
                        <strong>{reminder.text}</strong>
                        {formatOptionalTime(reminder.due_at) ? (
                          <span>Due {formatOptionalTime(reminder.due_at)}</span>
                        ) : null}
                      </span>
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="empty-state">No events or reminders for this day.</p>
          )}
        </div>
      ) : null}
    </section>
  );
}
