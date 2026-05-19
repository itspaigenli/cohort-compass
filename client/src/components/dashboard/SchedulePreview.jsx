import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  formatDayLabel,
  formatScheduleDateRange,
  isSameCalendarDay,
  normalizeScheduleItems,
  startOfLocalDay,
  toDateKey,
} from "../../utils/dateTime.js";

function getDayLabel(date = new Date()) {
  return formatDayLabel(date);
}

function getLocationLabel(location = "") {
  if (!location) {
    return "";
  }

  if (/^https?:\/\//i.test(location)) {
    if (location.includes("zoom.us")) {
      return "Zoom";
    }

    return "Virtual meeting";
  }

  return location;
}

function getPanelHeading(date, today, options = {}) {
  if (options.mobileSingleDay) {
    return "Day snapshot";
  }

  return "Two-day snapshot";
}

function getColumnHeading(date, today, options = {}) {
  if (options.mobileSingleDay) {
    if (isSameCalendarDay(date, today)) {
      return `Today · ${getDayLabel(date)}`;
    }

    return getDayLabel(date);
  }

  if (isSameCalendarDay(date, today)) {
    return `Today · ${getDayLabel(date)}`;
  }

  if (isSameCalendarDay(date, addDays(today, 1))) {
    return `Tomorrow · ${getDayLabel(date)}`;
  }

  return getDayLabel(date);
}

function getIsMobileViewport() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  return window.matchMedia("(max-width: 960px)").matches;
}

export default function SchedulePreview({
  items,
  onLoadItemsForDate,
  className = "",
}) {
  const today = useMemo(() => startOfLocalDay(new Date()), []);
  const normalizedItems = useMemo(() => normalizeScheduleItems(items), [items]);
  const [anchorDay, setAnchorDay] = useState(today);
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);
  const [dayCollections, setDayCollections] = useState(() => ({
    [toDateKey(today)]: normalizedItems.filter((item) => isSameCalendarDay(item.start_time, today)),
    [toDateKey(addDays(today, 1))]: normalizedItems.filter((item) =>
      isSameCalendarDay(item.start_time, addDays(today, 1)),
    ),
  }));

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 960px)");
    const handleChange = (event) => setIsMobileViewport(event.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadItemsForDay(targetDate) {
      const dateKey = toDateKey(targetDate);
      const fallbackItems = normalizedItems.filter((item) =>
        isSameCalendarDay(item.start_time, targetDate),
      );

      if (!onLoadItemsForDate) {
        if (!cancelled) {
          setDayCollections((current) => ({
            ...current,
            [dateKey]: fallbackItems,
          }));
        }
        return;
      }

      try {
        const nextItems = normalizeScheduleItems(await onLoadItemsForDate({ date: dateKey }));

        if (!cancelled) {
          setDayCollections((current) => ({
            ...current,
            [dateKey]: nextItems.length || !fallbackItems.length ? nextItems : fallbackItems,
          }));
        }
      } catch {
        if (!cancelled) {
          setDayCollections((current) => ({
            ...current,
            [dateKey]: fallbackItems,
          }));
        }
      }
    }

    loadItemsForDay(anchorDay);
    loadItemsForDay(addDays(anchorDay, 1));

    return () => {
      cancelled = true;
    };
  }, [anchorDay, normalizedItems, onLoadItemsForDate, today]);

  const tomorrow = addDays(anchorDay, 1);
  const anchorKey = toDateKey(anchorDay);
  const tomorrowKey = toDateKey(tomorrow);
  const anchorItems = (dayCollections[anchorKey] || []).filter((item) =>
    isSameCalendarDay(item.start_time, anchorDay),
  );
  const tomorrowItems = (dayCollections[tomorrowKey] || []).filter((item) =>
    isSameCalendarDay(item.start_time, tomorrow),
  );
  const heading = getPanelHeading(anchorDay, today, { mobileSingleDay: isMobileViewport });
  const dayStep = isMobileViewport ? 1 : 2;

  return (
    <section className={`panel schedule-panel ${className}`.trim()}>
      <div className="panel-header">
        <div>
          <h2>{heading}</h2>
        </div>
        <div className="schedule-nav">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous days"
            onClick={() => setAnchorDay((current) => addDays(current, -dayStep))}
          >
            <i className="fa-solid fa-circle-arrow-left" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next days"
            onClick={() => setAnchorDay((current) => addDays(current, dayStep))}
          >
            <i className="fa-solid fa-circle-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="schedule-columns">
        <section className="schedule-day">
          <div className="schedule-day-header">
            <h3>{getColumnHeading(anchorDay, today, { mobileSingleDay: isMobileViewport })}</h3>
          </div>
          {anchorItems.length ? (
            <ul className="schedule-list">
              {anchorItems.map((item) => (
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

        {!isMobileViewport ? (
          <section className="schedule-day">
            <div className="schedule-day-header">
              <h3>{getColumnHeading(tomorrow, today)}</h3>
            </div>
            {tomorrowItems.length ? (
              <ul className="schedule-list">
                {tomorrowItems.map((item) => (
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
        ) : null}
      </div>
    </section>
  );
}
