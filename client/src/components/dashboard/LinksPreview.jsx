import { useEffect, useState } from "react";
import { fetchLinks } from "../../services/linksApi.js";

export default function LinksPreview() {
  const [links, setLinks] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLinks() {
      try {
        const items = await fetchLinks();

        setLinks(items);
        setStatus("success");
      } catch (error) {
        setErrorMessage(error.message);
        setStatus("error");
      }
    }

    loadLinks();
  }, []);

  if (status === "loading") {
    return <p>Loading links...</p>;
  }

  if (status === "error") {
    return <p>{errorMessage}</p>;
  }

  if (!links.length) {
    return <p>No important links yet.</p>;
  }

  return (
    <ul>
      {links.map((link) => (
        <li key={link.id}>
          <h3>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.title}
            </a>
          </h3>
          <p>{link.description}</p>
          <p>{link.category}</p>
        </li>
      ))}
    </ul>
  );
}
