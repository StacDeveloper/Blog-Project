import type { AuthenticateReq } from "../middleware/isAuth.js";
import type { Response } from "express";
import TryCatch from "../utils/trycatch.js";
import getBuffer from "../utils/datauri.js";
import { v2 as cloudinary } from "cloudinary"
import { pgsql } from "../utils/db.js";



export const createBlog = TryCatch(async (req: AuthenticateReq, res: Response) => {
    const { title, description, blogcontent, category } = req.body
    const file = req.file

    if (!file) {
        res.status(400).json({ success: false, message: "No files to upload" })
        return
    }

    const filebuffer = getBuffer(file!)

    if (!filebuffer || !filebuffer.content) {
        res.status(400).json({ success: false, message: "No content in file" })
        return
    }

    const cloud = await cloudinary.uploader.upload(filebuffer.content, {
        folder: "blogs"
    })

    const result = await pgsql`INSERT INTO blogs (title, description, image, blogcontent, category, author) VALUES (${title}, ${description}, ${cloud.secure_url}, ${blogcontent}, ${category}, ${req.user?._id}) RETURNING *`

    return res.json({ success: true, blog: result[0] })



})

export const updateBlog = TryCatch(async (req: AuthenticateReq, res: Response) => {
    const { id } = req.params
    const { title, description, blogcontent, category } = req.body
    const file = req.file

    const blog = await pgsql`Select * FROM blogs WHERE id = ${id}`
    if (!blog.length) {
        res.status(400).json({ success: false, message: "no blog found" })
        return
    }
    if (blog[0]!.author !== req.user?._id) {
        res.status(400).json({ success: false, message: "you are not author of this blog" })
        return
    }
    let imageURl = blog[0]!.image

    if (file) {
        const fileBuffer = getBuffer(file)
        if (!fileBuffer || !fileBuffer.content) {
            res.status(400).json({ success: false, message: "No content in file" })
            return
        }
        const cloud = await cloudinary.uploader.upload(fileBuffer.content, {
            folder: "blogs"
        })

        imageURl = cloud.secure_url

        const updatedBlog = await pgsql`UPDATE blogs SET
        title = ${title || blog[0]?.title},
        description = ${description || blog[0]?.description},
        image=${imageURl},
        blogcontent = ${blogcontent || blog[0]?.blogcontent},
        category = ${category || blog[0]?.category}
        WHERE id= ${id}
        RETURNING *
        `;
        res.json({ success: true, blog: updatedBlog[0] })
    }



})

export const deleteblog = TryCatch(async (req: AuthenticateReq, res: Response) => {
    const blog = await pgsql`Select * FROM blogs WHERE id=${req.params.id}`

    if (blog[0]?.author !== req.user?._id) {
        res.status(400).json({ success: false, message: "You are not author of this blog" })
        return
    }

    await pgsql`DELETE FROM saveblogs WHERE blogid=${req.params.id}`
    await pgsql`DELETE FROM comments WHERE blogid=${req.params.id}`
    await pgsql`DELETE FROM blogs WHERE id=${req.params.id}`

    res.json({ success: true, message: "Blog deleted" })

})


