import mongoose, { Document, Schema } from "mongoose"

export interface Iuser extends Document {
    name: string,
    email: string,
    image: string,
    instagram: string,
    facebook: string,
    linkedin: string,
    bio: string
}

const userSchema: Schema<Iuser> = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    instagram: {
        type: String

    },
    facebook: {
        type: String

    },
    linkedin: {
        type: String
    },
    bio: {
        type: String

    },
}, { timestamps: true })

const User = mongoose.model<Iuser>("user", userSchema)

export default User