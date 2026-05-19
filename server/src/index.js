import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDatabaseConnection } from "./config/db.js";
import contentRoutes from "./routes/contentRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import linksRoutes from "./routes/linksRoutes.js";
import remindersRoutes from "./routes/remindersRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import { searchLinksAndFaq } from "./models/searchModel.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  }),
);

app.use(express.json());

app.use("/api/faq", faqRoutes);
app.use("/api/links", linksRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/content", contentRoutes);

app.get("/api/search", async (req, res) => {
  try {
    const searchTerm = req.query.q || "";
    const results = await searchLinksAndFaq(searchTerm);

    res.json(results);
  } catch (error) {
    console.error("Error searching Cohort Compass content:", error);

    res.status(500).json({ error: "Unable to search Cohort Compass content." });
  }
});

app.get("/", async (req, res) => {
  const databaseConnected = await checkDatabaseConnection();

  res.json({
    message: "Cohort Compass server is running",
    databaseConnected,
    mode: databaseConnected ? "database" : "database-unavailable",
  });
});

export default app;

if (process.env.NODE_ENV !== "test" && process.env.VITEST !== "true") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
