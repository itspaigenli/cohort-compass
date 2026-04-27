import { useEffect, useState } from "react";
import { fetchScheduleItems } from "../api/scheduleApi.js";

export default function ScheduleList() {
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

  return (
    <section>
      <h2>Upcoming Schedule</h2>

      <ul>
        {scheduleItems.map((item) => (
          <li key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <p>
              {new Date(item.start_time).toLocaleString()} -{" "}
              {new Date(item.end_time).toLocaleString()}
            </p>
            <p>{item.location}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
