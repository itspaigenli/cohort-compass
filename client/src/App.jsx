import DashboardPage from "./pages/DashboardPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

function App() {
  const hash = window.location.hash;
  const page = hash === "#search" || hash === "#faq" ? hash.slice(1) : "dashboard";

  return (
    <main className="app-shell">
      {page === "search" ? <SearchPage /> : null}
      {page === "faq" ? <FAQPage /> : null}
      {page === "dashboard" ? <DashboardPage /> : null}
    </main>
  );
}

export default App;
