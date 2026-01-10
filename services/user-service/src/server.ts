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
// aaaaaaaaaaaaaaaaaaaa================
app.use("/api/user", userRouter)
app.use("/try", (req, res) => {
    res.json({ success: true, message: "Trying CI/CD" })
})
app.use("/health", (req, res) => {
    res.status(200).json({ success: true, message: "User-service is working" })
})

app.use("/mandem", (req,res)=>{
    res.status(200).json({success:true, message:"Hellow from mandem"})
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})