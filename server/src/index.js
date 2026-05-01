import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDatabaseConnection } from "./config/db.js";
import faqRoutes from "./routes/faqRoutes.js";
import linksRoutes from "./routes/linksRoutes.js";
import remindersRoutes from "./routes/remindersRoutes.js";
import scheduleRoutes from "./routes/scheduleRoutes.js";

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
