export const TryCatch = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            console.log(error);
        }
    };
};
//# sourceMappingURL=trycatch.js.map