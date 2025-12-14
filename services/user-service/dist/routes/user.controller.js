import express from "express";
import { loginUser } from "../controllers/user.controller.js";
const userRouter = express.Router();
userRouter.post("/login", loginUser);
export default userRouter;
//# sourceMappingURL=user.controller.js.map