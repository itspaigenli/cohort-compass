const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthlyCalendar({ year, monthIndex }) {
  const monthName = new Date(year, monthIndex).toLocaleString("en-US", {
    month: "long",
  });
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const leadingBlankDays = Array.from({ length: firstWeekday });
  const monthDays = Array.from({ length: daysInMonth }, (_, index) => index + 1);

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
        {monthDays.map((day) => (
          <span key={day} className="monthly-calendar-day">
            {day}
          </span>
        ))}
      </div>
    </section>
  );
}
