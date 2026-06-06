import { Pool } from "pg";

console.log(process.env.DB_HOST, process.env.DB_PORT, process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD);
const pool = new Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default pool;
