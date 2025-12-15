import type { NextFunction, Request, Response, RequestHandler } from "express"

export const TryCatch = (handler: RequestHandler): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await handler(req, res, next)
        } catch (error: any) {
            console.log(error)
        }

    }
}