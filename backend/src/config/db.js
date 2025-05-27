import {neon} from "@neondatabase/serverless";

import { config } from "dotenv";
config();

export const sql =neon(process.env.DATABASE_URL);

export const initDB = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
            id SERIAL PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            title VARCHAR(255) NOT NULL,
            amount VARCHAR(255) NOT NULL,
            category VARCHAR(255) NOT NULL,
            created_at DATE NOT NULL DEFAULT CURRENT_DATE
        )`;
    console.log("✅ DATABASE initialized successfully");
  } catch (error) {
    console.log("❌ ERROR initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
};