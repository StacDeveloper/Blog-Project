import express from "express"
import dotenv from "dotenv"
import blogRouter from "./routes/blog.routes.js"
import { redisClient } from "./utils/redis.js"
import { startCacheConsumer } from "./utils/consumer.js"
import cors from "cors"


dotenv.config()

const app = express()

const PORT = process.env.PORT || 5002
app.use(express.json())
app.use(cors())
if (process.env.NODE_ENV !== "test") {
    await redisClient
    startCacheConsumer()
}
console.log("redis initialized")
app.use("/api/blog", blogRouter)
app.use("/try", (req, res) => {
    res.status(200).json({ success: true, message: "Trying ci/cd is working" })
})
app.use("/health", (req, res) => {
    res.status(200).json({ success: true, message: "Blog service is healthy" })
})
// asdasdasdasdsad
app.listen(PORT, () => {
    console.log(`Blog Service running on http://localhost:${PORT}`)
})