import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();
export const pgsql = neon(process.env.DBPGSQL);
//# sourceMappingURL=db.js.map