import express from "express";
import { getUserProfile, loginUser, myProfile, updateProfilePicture, updateUser } from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import uploadFile from "../middleware/multer.js";
const userRouter = express.Router();
userRouter.post("/login", loginUser);
userRouter.get("/me", isAuth, myProfile);
userRouter.get("/users/:id", getUserProfile);
userRouter.post("/users/update", isAuth, updateUser);
userRouter.post("/users/update/uploadpic", isAuth, uploadFile, updateProfilePicture);
export default userRouter;
//# sourceMappingURL=user.route.js.map