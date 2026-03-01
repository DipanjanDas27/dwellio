import { createPaymentsTable } from "../models/payment.model.js";
import { createPropertiesTable } from "../models/property.model.js";
import { createRentalTable } from "../models/rental.model.js";
import { createUsersTable } from "../models/user.model.js";
import { pool } from "./db.js";

export const initializeDatabase = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto";`);
    await pool.query(`CREATE EXTENSION IF NOT EXISTS btree_gist;`);
    console.log("extensions added successfully");
    await createUsersTable();
    await createPropertiesTable();
    await createRentalTable();
    await createPaymentsTable();
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Database initialization failed:", err.message);
    process.exit(1);
  }
};

export default initializeDatabase;