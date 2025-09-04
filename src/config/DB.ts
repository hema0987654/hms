import dotenv from "dotenv";
dotenv.config();
import { Pool } from "pg";
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME,
});

export default pool;
