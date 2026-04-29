import { useEffect, useState } from "react";
import { fetchScheduleItems } from "../../api/scheduleApi.js";

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
          <p>{item.date_and_duration_string}</p>
          <p>{item.location}</p>
        </li>
      ))}
    </ul>
  );
}
