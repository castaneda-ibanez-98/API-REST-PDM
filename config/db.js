import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
 
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  typeCast: (field, next) =>
  field.type === "TINY" && field.length === 1 ? field.string() === "1" : next(),
});
 
export default pool;