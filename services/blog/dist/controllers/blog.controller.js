import { pgsql } from "../utils/db.js";
import { redisClient } from "../utils/redis.js";
import { TryCatch } from "../utils/trycatch.js";
import axios from "axios";
export const getAllBlogs = TryCatch(async (req, res) => {
    const { searchQuery = "", category = "" } = req.query;
    let blogs;
    const cacheKey = `blogs:${searchQuery}:${category}`;
    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
        console.log("Serving from redis cache");
        const parsedData = typeof cacheData === "string" ? JSON.parse(cacheData) : cacheData;
        res.json(parsedData);
        return;
    }
    if (searchQuery && category) {
        console.log("1st query has runned" + searchQuery + "and" + category);
        const pattern = `%${searchQuery}%`;
        blogs = await pgsql `SELECT * FROM blogs WHERE (title ILIKE ${pattern} OR description ILIKE ${pattern}) AND category = ${category} ORDER BY created_at DESC`;
    }
    else if (searchQuery) {
        console.log("else if query has runned" + searchQuery);
        const pattern = `%${searchQuery}%`;
        blogs = await pgsql `SELECT * FROM blogs WHERE (title ILIKE ${pattern} OR description ILIKE ${pattern}) ORDER BY created_at DESC`;
    }
    else if (category) {
        const pattern = `%${category}%`;
        blogs = await pgsql `SELECT * FROM blogs WHERE (category ILIKE ${pattern}) ORDER BY created_at DESC `;
    }
    else {
        console.log("else query runn");
        blogs = await pgsql `SELECT * FROM blogs ORDER BY created_at DESC`;
    }
    console.log("Serving from PGDB");
    await redisClient.set(cacheKey, JSON.stringify(blogs), {
        ex: 3600
    });
    res.json({ success: true, blogs });
});
export const getSingleBlogs = TryCatch(async (req, res) => {
    const blogid = req.params.id;
    const cacheKey = `blog:${blogid}`;
    const cacheData = await redisClient.get(cacheKey);
    if (cacheData) {
        console.log("serving from redis cache");
        const parsedData = typeof cacheData === "string" ? JSON.parse(cacheData) : cacheData;
        res.json({ success: true, blogs: parsedData });
        console.log("serving from redis");
        return;
    }
    const blog = await pgsql `SELECT * FROM blogs WHERE id=${blogid}`;
    if (blog.length === 0) {
        res.json({ success: true, message: "no blog available with this id" });
        return;
    }
    const { data } = await axios.get(`${process.env.USER_SERVICE}/api/user/users/${blog[0].author}`);
    await redisClient.set(cacheKey, JSON.stringify(data), {
        ex: 3600
    });
    console.log("serving from pgdb");
    res.json({ success: true, blog: blog[0], author: data });
});
//# sourceMappingURL=blog.controller.js.map