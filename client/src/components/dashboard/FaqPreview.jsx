import { useEffect, useState } from "react";
import { fetchFaqEntries } from "../../services/faqApi.js";

export default function FaqPreview() {
  const [faqEntries, setFaqEntries] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadFaqEntries() {
      try {
        const entries = await fetchFaqEntries();

        setFaqEntries(entries);
        setStatus("success");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    }

    loadFaqEntries();
  }, []);

  if (status === "loading") {
    return <p>Loading FAQ...</p>;
  }

  if (status === "error") {
    return <p>{errorMessage}</p>;
  }

  if (!faqEntries.length) {
    return <p>No FAQ entries yet.</p>;
  }

  return (
    <ul>
      {faqEntries.map((entry) => (
        <li key={entry.id}>
          <h3>{entry.question}</h3>
          <p>{entry.answer}</p>
          <p>{entry.category}</p>
        </li>
      ))}
    </ul>
  );
}
