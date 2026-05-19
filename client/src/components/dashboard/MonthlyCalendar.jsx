const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthlyCalendar({ year, monthIndex, scheduleItems = [] }) {
  const today = new Date();
  const monthName = new Date(year, monthIndex).toLocaleString("en-US", {
    month: "long",
  });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const leadingBlankDays = Array.from({ length: firstWeekday });
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);

  function getScheduleItemsForDay(day) {
    return scheduleItems.filter((item) => {
      const itemDate = new Date(item.start_time);

      return (
        itemDate.getFullYear() === year &&
        itemDate.getMonth() === monthIndex &&
        itemDate.getDate() === day
      );
    });
  }

  function isToday(day) {
    return (
      today.getFullYear() === year &&
      today.getMonth() === monthIndex &&
      today.getDate() === day
    );
  }

  return (
    <section className="monthly-calendar" aria-labelledby="monthly-calendar-heading">
      <h3 id="monthly-calendar-heading">
        {monthName} {year}
      </h3>
      <div className="monthly-calendar-grid">
        {weekdayLabels.map((label) => (
          <span key={label} className="monthly-calendar-weekday">
            {label}
          </span>
        ))}
        {leadingBlankDays.map((_, index) => (
          <span
            key={`blank-${index}`}
            className="monthly-calendar-day monthly-calendar-day-empty"
            aria-hidden="true"
          />
        ))}
        {monthDays.map((day) => {
          const dayScheduleItems = getScheduleItemsForDay(day);
          const hasEvents = dayScheduleItems.length > 0;
          const dayLabel = `${monthName} ${day}, ${year}${
            hasEvents ? `, ${dayScheduleItems.length} schedule item` : ""
          }${isToday(day) ? ", today" : ""}`;

          return (
            <span
              key={day}
              className={`monthly-calendar-day${isToday(day) ? " monthly-calendar-day-today" : ""}`}
              aria-label={dayLabel}
            >
              <span className="monthly-calendar-day-number">{day}</span>
              {dayScheduleItems.map((item) => (
                <span key={item.id} className="monthly-calendar-event">
                  {item.title}
                </span>
              ))}
            </span>
          );
        })}
      </div>
    </section>
  );
}
