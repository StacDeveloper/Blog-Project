import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRouter from "./routes/user.route.js";
import cloudConfiguration from "./utils/cloudinary.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT;
app.use(express.json());
await connectDB();
await cloudConfiguration();
app.use("/api/user", userRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost/${PORT}`);
});
//# sourceMappingURL=server.js.map