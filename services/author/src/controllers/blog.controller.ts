import type { AuthenticateReq } from "../middleware/isAuth.js";
import { text, type Response } from "express";
import TryCatch from "../utils/trycatch.js";
import getBuffer from "../utils/datauri.js";
import { v2 as cloudinary } from "cloudinary"
import { pgsql } from "../utils/db.js";
import { invalidateCacheJob } from "../utils/rabbitmq.js";
import { GoogleGenAI } from "@google/genai";



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

    await invalidateCacheJob(["blogs:*"])

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
        await invalidateCacheJob(["blogs:*", `blog:${id}`])
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

    await invalidateCacheJob(["blogs:*", `blog:${req.params.id}`])
    res.json({ success: true, message: "Blog deleted" })

})

export const AItitleResponse = TryCatch(async (req, res) => {
    const { text } = req.body

    const prompt = `Correct the grammer of the following blog title and return only the corrected title without any additional text, formatting or symbols: ${text}`;


    if (!text) {
        res.status(400).json({ success: false, message: "Gemini did not worked" })
        return
    }
    const ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY! as string
    })
    let result
    async function geminiFunction() {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        })
        let rawtext = response.text
        if (!rawtext) {
            res.status(400).json({ success: false, message: "Gemini did not worked" })
            return
        }
        result = rawtext?.replace(/\*\*/g, "").replace(/[\r\n]+/g, "").replace(/[*_`~]/g, "").trim()

    }
    await geminiFunction()
    res.json({ success: true, result })
})

export const AiDescResponse = TryCatch(async (req, res) => {
    const { title, description } = req.body
    const prompt = description === "" ? `Generate only one short blog description based on this :"${title}". Your response must be only one sentence, strictly under 30 words, with no options, no greetings, and no extra text. Do not explain. Do not say 'here is'. Just return the description only` : `Fix the grammer in the following blog description and return only the corrected sentence. Do not add anything else:"${description}"`

    let result

    async function geminidescription() {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!
        })

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        })
        const rawtext = response.text

        if (!rawtext) {
            res.status(400).json({ success: false, message: "Sorry Cant Process request at the moment" })
        }

        result = rawtext?.replace(/\*\*/g, "").replace(/[\r\n]+/g, "").replace(/[*_`~]/g, "").trim()
    }
    await geminidescription()
    res.status(200).json({ success: true, result })
})



export const aiBlogResponse = TryCatch(async (req, res) => {
    const { blog } = req.body
    
    if (!blog) {
        return res.status(400).json({ success: false, message: "Please provide blog content" })
    }
    
    const prompt = `You will act as a grammar correction engine. I will provide you with blog content in rich HTML format (from Jodit Editor). Do not generate or rewrite the content with new ideas. Only correct grammatical, punctuation, and spelling errors while preserving all HTML tags and formatting. Maintain inline styles, image tags, line breaks, and structural tags exactly as they are. Return the full corrected HTML string as output.`

    const fullmessage = `${prompt}\n\n${blog}`

    try {
        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY!
        })

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullmessage
        })
        
        const rawtext = response.text

        if (!rawtext) {
            return res.status(400).json({ 
                success: false, 
                message: "Sorry, can't process request at the moment" 
            })
        }

        // Clean the HTML response
        const result = rawtext
            .replace(/```html\n?/gi, "")      // Remove ```html
            .replace(/```\n?/g, "")            // Remove ```
            .replace(/^\s*html\s*/i, "")      // Remove leading "html"
            .replace(/\*\*/g, "")              // Remove **
            .replace(/[*_`~]/g, "")            // Remove markdown symbols
            .trim()

        res.status(200).json({ success: true, html: result })
        
    } catch (error: any) {
        console.error("Gemini API Error:", error)
        
        if (error.status === 429) {
            return res.status(429).json({ 
                success: false, 
                message: "Rate limit exceeded. Please try again later." 
            })
        }
        
        res.status(500).json({ 
            success: false, 
            message: error.message || "Failed to process blog content" 
        })
    }
})