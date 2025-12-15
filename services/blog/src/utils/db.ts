import dotenv from "dotenv"
import { neon } from "@neondatabase/serverless"
dotenv.config()

export const pgsql = neon(process.env.DB_URL as string)