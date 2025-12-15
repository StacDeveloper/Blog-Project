import express from "express"
import dotenv from "dotenv"
import blogRouter from "./routes/blog.routes.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT

app.use("/api/blog", blogRouter)

app.listen(PORT, () => {
    console.log(`Blog Service running on http://localhost:${PORT}`)
})