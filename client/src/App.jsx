import { useEffect, useMemo, useState } from "react";
import DashboardPage from "./pages/DashboardPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import { fetchContentDocuments } from "./services/contentApi.js";
import { fetchCurriculumReferences } from "./services/curriculumApi.js";
import { fetchFaqEntries } from "./services/faqApi.js";
import { fetchLinks } from "./services/linksApi.js";
import { fetchReminders } from "./services/remindersApi.js";
import { fetchScheduleItems } from "./services/scheduleApi.js";
import { searchStudentHub } from "./services/searchApi.js";

const appPages = ["dashboard", "search", "faq"];

function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");

  return appPages.includes(hash) ? hash : "dashboard";
}

function App() {
  const [page, setPage] = useState(getPageFromHash);
  const [links, setLinks] = useState([]);
  const [faqEntries, setFaqEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [contentDocuments, setContentDocuments] = useState([]);
  const [curriculumReferences, setCurriculumReferences] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    links: [],
    faqEntries: [],
    curriculumReferences: [],
    contentDocuments: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function handleHashChange() {
      setPage(getPageFromHash());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    async function loadAppData() {
      const [
        nextLinks,
        nextFaqEntries,
        nextReminders,
        nextScheduleItems,
        nextContentDocuments,
        nextCurriculumReferences,
      ] = await Promise.all([
        fetchLinks(),
        fetchFaqEntries(),
        fetchReminders(),
        fetchScheduleItems(),
        fetchContentDocuments(),
        fetchCurriculumReferences(),
      ]);

      setLinks(nextLinks);
      setFaqEntries(nextFaqEntries);
      setReminders(nextReminders);
      setScheduleItems(nextScheduleItems);
      setContentDocuments(nextContentDocuments);
      setCurriculumReferences(nextCurriculumReferences);
      setIsLoading(false);
    }

    loadAppData();
  }, []);

  async function handleSearch(query) {
    const trimmedQuery = query.trim();

    setSearchQuery(trimmedQuery);
    setSearchResults(await searchStudentHub(trimmedQuery));
    window.location.hash = "search";
  }

  const pageContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="loading-dot" />
          <p>Loading Cohort Compass...</p>
        </div>
      );
    }

    if (page === "search") {
      return (
        <SearchPage
          query={searchQuery}
          results={searchResults}
          onSearch={handleSearch}
        />
      );
    }

    if (page === "faq") {
      return <FAQPage faqEntries={faqEntries} />;
    }

    return (
      <DashboardPage
        links={links}
        faqEntries={faqEntries}
        reminders={reminders}
        onRemindersChange={setReminders}
        scheduleItems={scheduleItems}
        contentDocuments={contentDocuments}
        curriculumReferences={curriculumReferences}
        onSearch={handleSearch}
      />
    );
  }, [
    contentDocuments,
    curriculumReferences,
    faqEntries,
    isLoading,
    links,
    page,
    reminders,
    scheduleItems,
    searchQuery,
    searchResults,
  ]);

  return (
    <main className="app-shell">
      {pageContent}
    </main>
  );
}

export default App;
