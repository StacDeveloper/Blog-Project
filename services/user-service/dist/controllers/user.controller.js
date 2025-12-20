import User from "../models/user.js";
import jwt, {} from "jsonwebtoken";
import TryCatch from "../utils/trycatch.js";
import getBuffer from "../utils/dataUri.js";
import { v2 as cloudinary } from "cloudinary";
import { oAuth2client } from "../utils/googleconfig.js";
import axios from "axios";
export const loginUser = TryCatch(async (req, res) => {
    const { code } = req.body;
    if (!code) {
        res.status(400).json({ success: false, message: "Authorization code is required" });
        return;
    }
    const googlersponse = await oAuth2client.getToken(code);
    oAuth2client.setCredentials(googlersponse.tokens);
    const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googlersponse.tokens.access_token}`);
    const { email, name, picture } = userResponse.data;
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({
            name,
            email,
            image: picture,
        });
    }
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d"
    });
    res.status(200).json({ success: true, message: "Login Success", token, user });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const getUserProfile = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).json({ success: false, message: "No user found with this id!" });
        return;
    }
    res.json({ success: true, user });
});
export const updateUser = TryCatch(async (req, res) => {
    const { name, instagram, facebook, linkedin, bio } = req.body;
    const user = await User.findByIdAndUpdate(req.user?._id, {
        name: name,
        instagram,
        facebook,
        linkedin,
        bio
    }, { new: true });
    const token = jwt.sign({ user }, process.env.JWT_SEC, {
        expiresIn: "5d"
    });
    res.json({ success: true, message: "User profile updated", token, user });
});
export const updateProfilePicture = TryCatch(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.json({ sucess: false, message: "no file to upload" });
        return;
    }
    const fileBuffer = getBuffer(file);
    if (!fileBuffer || !fileBuffer.content) {
        res.json({ success: false, message: "No file buffer or content" });
        return;
    }
    const image = await cloudinary.uploader.upload(fileBuffer.content, {
        folder: "blogs"
    });
    const user = await User.findByIdAndUpdate(req.user?._id, {
        image: image.secure_url
    }, { new: true });
    const token = jwt.sign({ user }, process.env.JWT_SEC);
    res.json({ success: true, message: "User Profile Pic Uploaded", user, token });
});
//# sourceMappingURL=user.controller.js.map