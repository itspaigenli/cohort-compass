import DashboardPage from "./pages/DashboardPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";

function App() {
  const page = window.location.hash === "#search" ? "search" : "dashboard";

  return (
    <main className="app-shell">
      {page === "search" ? <SearchPage /> : <DashboardPage />}
    </main>
  );
}

export default App;
