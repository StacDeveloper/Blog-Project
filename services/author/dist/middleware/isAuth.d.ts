import type { NextFunction, Request, Response } from "express";
interface Iuser extends Document {
    _id: string;
    name: string;
    email: string;
    image: string;
    instagram: string;
    facebook: string;
    linkedin: string;
}
export interface AuthenticateReq extends Request {
    user?: Iuser | null;
}
export declare const isAuth: (req: AuthenticateReq, res: Response, next: NextFunction) => Promise<void>;
export {};
//# sourceMappingURL=isAuth.d.ts.map