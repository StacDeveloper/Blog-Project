import type { Request, Response, NextFunction } from "express";
import type { Iuser } from "../models/user.js";
export interface AuthenticatedReq extends Request {
    user?: Iuser | null;
}
export declare const isAuth: (req: AuthenticatedReq, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=isAuth.d.ts.map