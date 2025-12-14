import mongoose, { Document } from "mongoose";
export interface Iuser extends Document {
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    linkedin: string;
    bio: string;
}
declare const User: mongoose.Model<Iuser, {}, {}, {}, mongoose.Document<unknown, {}, Iuser, {}, mongoose.DefaultSchemaOptions> & Iuser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any, Iuser>;
export default User;
//# sourceMappingURL=user.d.ts.map