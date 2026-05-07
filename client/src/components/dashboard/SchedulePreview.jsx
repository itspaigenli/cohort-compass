import { useEffect, useState } from "react";
import { fetchScheduleItems } from "../../services/scheduleApi.js";

export default function SchedulePreview() {
  const [scheduleItems, setScheduleItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadScheduleItems() {
      try {
        const items = await fetchScheduleItems();

        setScheduleItems(items);
        setStatus("success");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    }

    loadScheduleItems();
  }, []);

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
          {item.meeting_url ? (
            <a href={item.meeting_url} target="_blank" rel="noreferrer">
              Open meeting
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
