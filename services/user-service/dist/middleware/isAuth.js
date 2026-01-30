import jwt, {} from "jsonwebtoken";
export const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith(`Bearer`)) {
            res.status(401).json({ success: false, message: "Please Login - No - Auth - Error" });
            return;
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            res.status(401).json({ success: false, message: "Token is not available" });
        }
        const decodevalue = jwt.verify(token, process.env.JWT_SEC);
        if (!decodevalue || !decodevalue.user) {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
        req.user = decodevalue.user;
        next();
    }
    catch (error) {
        console.error("JWT verify error", error);
        res.status(401).json({ success: false, message: "Please Login" });
    }
};
//# sourceMappingURL=isAuth.js.map