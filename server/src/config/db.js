import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;
const useDatabaseSsl = process.env.DATABASE_SSL === "true";

const pool = connectionString
  ? new Pool({
      connectionString,
      ssl: useDatabaseSsl ? { rejectUnauthorized: false } : false,
    })
  : null;

export async function query(text, params = []) {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured.");
  }

  return pool.query(text, params);
}

export async function checkDatabaseConnection() {
  if (!pool) {
    return false;
  }

  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
}

export default pool;
