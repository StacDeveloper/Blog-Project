import mongoose, { Document, Schema } from "mongoose";
const userSchema = new Schema({
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
    bio: {
        type: String
    },
}, { timestamps: true });
const User = mongoose.model("user", userSchema);
export default User;
//# sourceMappingURL=user.js.map