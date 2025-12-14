import express from "express"
import { isAuth } from "../middleware/isAuth.js"
import uploadFile from "../middleware/multer.js"
import { createBlog, deleteblog, updateBlog } from "../controllers/blog.controller.js"

const authRouter = express.Router()

authRouter.post("/blog/new", isAuth, uploadFile, createBlog)
authRouter.post("/blog/:id", isAuth, uploadFile, updateBlog)
authRouter.delete("/blog/:id", isAuth, deleteblog)

export default authRouter