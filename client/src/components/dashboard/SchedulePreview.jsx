import { useEffect, useState } from "react";
import { fetchScheduleItems } from "../../services/scheduleApi.js";

export default function SchedulePreview({ onScheduleItemsLoaded }) {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasGoogleCalendarItems = scheduleItems.some((item) => {
    return item.source === "google-calendar";
  });

  useEffect(() => {
    async function loadScheduleItems() {
      try {
        const items = await fetchScheduleItems();

        setScheduleItems(items);
        onScheduleItemsLoaded?.(items);
        setStatus("success");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    }

    loadScheduleItems();
  }, [onScheduleItemsLoaded]);

  if (status === "loading") {
    return <p>Loading schedule...</p>;
  }

  if (status === "error") {
    return <p>{errorMessage}</p>;
  }

  if (!scheduleItems.length) {
    return <p>No upcoming schedule items yet.</p>;
  }

  return (
    <div className="schedule-preview">
      <p className="schedule-source-note">
        {hasGoogleCalendarItems
          ? "Showing events from Google Calendar."
          : "Showing saved schedule items."}
      </p>
      <ul>
        {scheduleItems.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>
              <strong>When:</strong> {item.date_and_duration_string}
            </p>
            {item.location ? (
              <p>
                <strong>Where:</strong> {item.location}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
