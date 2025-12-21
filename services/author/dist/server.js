import express from "express";
import dotenv from "dotenv";
import { initDB } from "./utils/db.js";
import authRouter from "./routes/blog.routes.js";
import cloudConfiguration from "./utils/cloudinary.js";
import { connectRabbitmq } from "./utils/rabbitmq.js";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
app.use(cors());
await initDB();
await cloudConfiguration();
await connectRabbitmq();
app.use("/api/auth", authRouter);
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Author Server is running on http://localhost:${PORT}`);
    });
});
//# sourceMappingURL=server.js.map