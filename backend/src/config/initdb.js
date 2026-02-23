import { pool } from "./db.js";

export const initializeDatabase = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    console.log("pgcrypto extension ensured");
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    process.exit(1);
  }
};

export default initializeDatabase;