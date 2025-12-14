import express from "express"
import dotenv from "dotenv"
import { pgsql } from "./utils/db.js"
import authRouter from "./routes/blog.routes.js"
import cloudConfiguration from "./utils/cloudinary.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT

app.use(express.json())

async function initDB() {
    try {
        await pgsql`
        CREATE TABLE IF NOT EXISTS blogs(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        blogcontent TEXT NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        await pgsql` 
        CREATE TABLE IF NOT EXISTS comments(
        id SERIAL PRIMARY KEY,
        comment VARCHAR(255) NOT NULL,
        userid VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        blogid VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;
        await pgsql`
        CREATE TABLE IF NOT EXISTS saveblogs(
        id SERIAL PRIMARY KEY,
        userid VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        blogid VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP        
        )`;

        console.log(`Database Initialize Successfully`)

    } catch (error: any) {
        console.log(error)
    }
}
await cloudConfiguration()

app.use("/api/auth", authRouter)


initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
    })
})

