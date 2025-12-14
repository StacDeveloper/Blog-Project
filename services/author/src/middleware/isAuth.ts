import type { NextFunction, Request, Response } from "express"
import jwt, { type JwtPayload } from "jsonwebtoken"


interface Iuser extends Document {
    _id:string,
    name: string,
    email: string,
    image: string,
    instagram: string,
    facebook: string,
    linkedin: string
}

export interface AuthenticateReq extends Request {
    user?: Iuser | null
}


export const isAuth = async (req: AuthenticateReq, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers?.authorization
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({ success: false, message: "Not Authenticated!" })
            return
        }

        const token = authHeader.split(" ")[1]
        const decodevalue = jwt.verify(token, process.env.JWT_SEC! as string) as JwtPayload

        if (!decodevalue || !decodevalue.user) {
            res.status(401).json({ success: false, message: "No user found" })
            return
        }

        req.user = decodevalue.user
        next()
    } catch (error) {
        console.log(error)
    }
}