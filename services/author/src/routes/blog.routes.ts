import express from "express"
import { isAuth } from "../middleware/isAuth.js"
import uploadFile from "../middleware/multer.js"
import { aiBlogResponse, AiDescResponse, AItitleResponse, createBlog, deleteblog, updateBlog } from "../controllers/blog.controller.js"

const authRouter = express.Router()

authRouter.post("/blog/new", isAuth, uploadFile, createBlog)
authRouter.post("/blog/:id", isAuth, uploadFile, updateBlog)
authRouter.delete("/blog/:id", isAuth, deleteblog)
authRouter.post("/blog/ai/title", isAuth, AItitleResponse)
authRouter.post("/blog/ai/description", isAuth, AiDescResponse)
authRouter.post("/blog/ai/aiblogresponse", isAuth, aiBlogResponse)

export default authRouter   