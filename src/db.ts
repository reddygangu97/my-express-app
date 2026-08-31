import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is required");
}

export const db = new Pool({ connectionString });

db.on("error", (error) => {
  console.error("Unexpected PostgreSQL pool error", error);
});
