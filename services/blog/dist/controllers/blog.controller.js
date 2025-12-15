import { pgsql } from "../utils/db.js";
import { TryCatch } from "../utils/trycatch.js";
export const getAllBlogs = TryCatch(async (req, res) => {
    let blogs;
    blogs = await pgsql `SELECT * FROM blogs ORDER BY created_at DESC`;
    res.json({ success: true, blogs });
});
//# sourceMappingURL=blog.controller.js.map