import User from "../models/user.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import TryCatch from "../utils/trycatch.js";
import type { AuthenticatedReq } from "../middleware/isAuth.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary"


export const loginUser = TryCatch(async (req, res) => {
    const { email, name, image } = req.body;
    let user = await User.findOne({ email })

    if (!user) {
        user = await User.create({
            name,
            email,
            image
        })
    }

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        expiresIn: "5d"
    })

    res.status(200).json({ success: true, message: "Login Success", token, user })
})




export const myProfile = TryCatch(async (req: AuthenticatedReq, res) => {
    const user = req.user
    res.json(user)
})

export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404).json({ success: false, message: "No user found with this id!" })
        return
    }

    res.json({ success: true, user })
})

export const updateUser = TryCatch(async (req: AuthenticatedReq, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body
    const user = await User.findByIdAndUpdate(req.user?._id, {
        name: name,
        instagram,
        facebook,
        linkedin,
        bio
    }, { new: true })

    const token = jwt.sign({ user }, process.env.JWT_SEC as string, {
        expiresIn: "5d"
    })

    res.json({ success: true, message: "User profile updated", token, user })
})

export const updateProfilePicture = TryCatch(async (req: AuthenticatedReq, res) => {
    const file = req.file
    if (!file) {
        res.json({ sucess: false, message: "no file to upload" })
        return
    }
    const fileBuffer = getBuffer(file)
    if (!fileBuffer || !fileBuffer.content) {
        res.json({ success: false, message: "No file buffer or content" })
        return
    }

    const image = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs"
    })

    const user = await User.findByIdAndUpdate(req.user?._id, {
        image: image.secure_url
    }, { new: true })

    const token = jwt.sign({ user }, process.env.JWT_SEC as string)

    res.json({ success: true, message: "User Profile Pic Uploaded", user, token })



})