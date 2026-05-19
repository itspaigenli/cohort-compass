import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { checkDatabaseConnection } from "./config/db.js";
import contentRoutes from "./routes/contentRoutes.js";
import curriculumRoutes from "./routes/curriculumRoutes.js";
import faqRoutes from "./routes/faqRoutes.js";
import linksRoutes from "./routes/linksRoutes.js";
import remindersRoutes from "./routes/remindersRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import searchRoutes from "./routes/search.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientBuildPath = path.join(__dirname, "../../client/dist");

const app = express();
const allowedClientOrigins = [
  process.env.CLIENT_ORIGIN,
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedClientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
  }),
);

app.use(express.json());

app.use("/api/faq", faqRoutes);
app.use("/api/links", linksRoutes);
app.use("/api/reminders", remindersRoutes);
app.use("/api/schedule", scheduleRoutes);
app.use("/api/curriculum", curriculumRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/search", searchRoutes);

app.get("/api/health", async (req, res) => {
  const databaseConnected = await checkDatabaseConnection();

  res.json({
    message: "Cohort Compass server is running",
    databaseConnected,
    mode: databaseConnected ? "database" : "database-unavailable",
  });
});

app.use(express.static(clientBuildPath));

app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(clientBuildPath, "index.html"));
});

export default app;

if (process.env.NODE_ENV !== "test" && process.env.VITEST !== "true") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
