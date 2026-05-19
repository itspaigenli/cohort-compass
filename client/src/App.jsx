import { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

function App() {
  const [hash, setHash] = useState(window.location.hash);
  const page = hash === "#search" || hash === "#faq" ? hash.slice(1) : "dashboard";

  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <main className="app-shell">
      {page === "search" ? <SearchPage /> : null}
      {page === "faq" ? <FAQPage /> : null}
      {page === "dashboard" ? <DashboardPage /> : null}
    </main>
  );
}

export default App;
