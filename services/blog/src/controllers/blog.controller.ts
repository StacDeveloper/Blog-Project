import { pgsql } from "../utils/db.js";
import { TryCatch } from "../utils/trycatch.js";

export const getAllBlogs = TryCatch(async (req, res) => {
    const { searchQuery, category } = req.query

    let blogs

    if (searchQuery && category) {
        console.log("1st query has runned" + searchQuery + "and" + category)
        const pattern = `%${searchQuery}%`
        blogs = await pgsql`SELECT * FROM blogs WHERE (title ILIKE ${pattern} OR description ILIKE ${pattern}) AND category = ${category} ORDER BY created_at DESC`
    }
    else if (searchQuery) {
        console.log("else if query has runned" + searchQuery)
        const pattern = `%${searchQuery}%`
        blogs = await pgsql`SELECT * FROM blogs WHERE (title ILIKE ${pattern} OR description ILIKE ${pattern}) ORDER BY created_at DESC`
    } else {
        console.log("else query runn")
        blogs = await pgsql`SELECT * FROM blogs ORDER BY created_at DESC`
    }
    res.json({ success: true, blogs })

})

export const getSingleBlogs = TryCatch(async (req, res) => {
    const blog=await pgsql`SELECT * FROM blogs WHERE id=${req.params.id}`
    res.json({success:true, blog})
 })