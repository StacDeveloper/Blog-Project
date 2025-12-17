import express from "express";
import { getAllBlogs, getSingleBlogs } from "../controllers/blog.controller.js";
const blogRouter = express.Router();
blogRouter.get("/blogs/allblogs", getAllBlogs);
blogRouter.get("/blogs/:id", getSingleBlogs);
export default blogRouter;
//# sourceMappingURL=blog.routes.js.map