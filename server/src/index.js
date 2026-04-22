import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDatabaseConnection } from "./config/db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  }),
);

app.use(express.json());

app.get("/", async (req, res) => {
  const databaseConnected = await checkDatabaseConnection();

  res.json({
    message: "Cohort Compass server is running",
    databaseConnected,
    mode: databaseConnected ? "database" : "db-fallback",
  });
});

export default app;

if (process.env.NODE_ENV !== "test" && process.env.VITEST !== "true") {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
