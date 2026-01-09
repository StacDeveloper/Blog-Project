import express from "express"
import dotenv from "dotenv"
import connectDB from "./utils/db.js"
import userRouter from "./routes/user.route.js"
import cloudConfiguration from "./utils/cloudinary.js"
import cors from "cors"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

if (process.env.NODE_ENV !== "test") {
    await connectDB()
    await cloudConfiguration()
}
// aaaaaaaaaaaaaaaaaaaaaasdasdasdasdasd
app.use("/api/user", userRouter)
app.use("/", (req, res) => {
    res.json({ success: true, message: "Trying CI/CD" })
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})