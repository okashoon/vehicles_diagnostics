import fs from "fs";
import path from "path";
import pool from "../lib/db";

async function migrate() {
  const sql = fs.readFileSync(path.join(__dirname, "migrate.sql"), "utf8");
  console.log("[migrate] Running migrations...");
  await pool.query(sql);
  console.log("[migrate] Done.");
  await pool.end();
}

migrate().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});
