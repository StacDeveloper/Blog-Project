import express from "express";
import { getAllBlogs } from "../controllers/blog.controller.js";
const blogRouter = express.Router();
blogRouter.get("/blogs/allblogs", getAllBlogs);
export default blogRouter;
//# sourceMappingURL=blog.routes.js.map