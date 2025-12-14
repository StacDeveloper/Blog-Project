import jwt, { type JwtPayload } from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"
import type { Iuser } from "../models/user.js"

export interface AuthenticatedReq extends Request {
    user?: Iuser | null
}

export const isAuth = async (req: AuthenticatedReq, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith(`Bearer`)) {
            res.status(401).json({ success: false, message: "Please Login - No - Auth - Error" })
            return
        }

        const token = authHeader.split(" ")[1]
        const decodevalue = jwt.verify(token, process.env.JWT_SEC! as string) as JwtPayload

        if (!decodevalue || !decodevalue.user) {
            res.status(401).json({ success: false, message: "Invalid token" })
            return
        }

        req.user = decodevalue.user
        next()


    } catch (error) {
        console.error("JWT verify error", error)
        res.status(401).json({ success: false, message: "Please Login" })
    }
}