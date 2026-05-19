import { useEffect, useState } from "react";
import Layout from "./components/shared/Layout.jsx";
import LoadingState from "./components/shared/LoadingState.jsx";
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
import {
  buildLocalUnifiedSearchResults,
  mergeUnifiedSearchResults,
} from "./utils/unifiedSearchHelpers.js";

const appPages = [
  { id: "dashboard", label: "Dashboard" },
  { id: "search", label: "Search" },
  { id: "faq", label: "FAQ" },
];

function parseHashLocation() {
  const hash = window.location.hash.replace("#", "");

  if (!hash) {
    return { page: "dashboard", anchor: "" };
  }

  const exactPage = appPages.find((item) => item.id === hash);

  if (exactPage) {
    return { page: exactPage.id, anchor: "" };
  }

  const anchoredPage = appPages.find((item) => hash.startsWith(`${item.id}-`));

  if (anchoredPage) {
    return { page: anchoredPage.id, anchor: hash };
  }

  return { page: "dashboard", anchor: "" };
}

function getInitialPage() {
  return parseHashLocation().page;
}

async function loadOptionalAppData(loader) {
  try {
    return await loader();
  } catch {
    return [];
  }
}

function App() {
  const [page, setPage] = useState(getInitialPage);
  const [links, setLinks] = useState([]);
  const [faqEntries, setFaqEntries] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [scheduleItems, setScheduleItems] = useState([]);
  const [contentDocuments, setContentDocuments] = useState([]);
  const [curriculumReferences, setCurriculumReferences] = useState([]);
  const [globalQuery, setGlobalQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    query: "",
    links: [],
    faqEntries: [],
    contentDocuments: [],
    curriculumReferences: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function handleHashChange() {
      const nextLocation = parseHashLocation();
      setPage(nextLocation.page);

      if (!nextLocation.anchor) {
        window.scrollTo(0, 0);
      }
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    const { page: hashPage, anchor } = parseHashLocation();

    if (!anchor || hashPage !== page) {
      return;
    }

    const scrollToAnchor = () => {
      const target = document.getElementById(anchor);

      if (!target) {
        return;
      }

      target.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const frameId = window.requestAnimationFrame(scrollToAnchor);
    return () => window.cancelAnimationFrame(frameId);
  }, [loading, page]);

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
        loadOptionalAppData(fetchLinks),
        loadOptionalAppData(fetchFaqEntries),
        loadOptionalAppData(fetchReminders),
        loadOptionalAppData(fetchScheduleItems),
        loadOptionalAppData(fetchContentDocuments),
        loadOptionalAppData(fetchCurriculumReferences),
      ]);

      setLinks(nextLinks);
      setFaqEntries(nextFaqEntries);
      setReminders(nextReminders);
      setScheduleItems(nextScheduleItems);
      setContentDocuments(nextContentDocuments);
      setCurriculumReferences(nextCurriculumReferences);
      setLoading(false);
    }

    loadAppData();
  }, []);

  function navigate(nextPage) {
    window.location.hash = nextPage;
    setPage(nextPage);
    window.scrollTo(0, 0);
  }

  async function runUnifiedSearch(query) {
    const localResults = buildLocalUnifiedSearchResults({
      query,
      links,
      faqEntries,
      contentDocuments,
      curriculumReferences,
    });
    const nextResults = mergeUnifiedSearchResults(
      await searchStudentHub(query),
      localResults,
    );

    setSearchResults(nextResults);
    return nextResults;
  }

  async function handleDashboardSearch(query) {
    const trimmedQuery = query.trim();

    setGlobalQuery(trimmedQuery);
    await runUnifiedSearch(trimmedQuery);
    navigate("search");
  }

  let pageContent = (
    <DashboardPage
      links={links}
      faqEntries={faqEntries}
      reminders={reminders}
      onRemindersChange={setReminders}
      scheduleItems={scheduleItems}
      onLoadScheduleItems={fetchScheduleItems}
      onSearch={handleDashboardSearch}
    />
  );

  if (page === "search") {
    pageContent = (
      <SearchPage
        query={globalQuery}
        results={searchResults}
        onSearch={handleDashboardSearch}
      />
    );
  }

  if (page === "faq") {
    pageContent = <FAQPage faqEntries={faqEntries} query={globalQuery} />;
  }

  return <Layout>{loading ? <LoadingState /> : pageContent}</Layout>;
}

export default App;
