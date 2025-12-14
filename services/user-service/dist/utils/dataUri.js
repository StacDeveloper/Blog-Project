import DataUriParser from "datauri/parser.js";
import path from "path";
const getBuffer = (file) => {
    const parser = new DataUriParser();
    const extenstionname = path.extname(file.originalname).toString();
    return parser.format(extenstionname, file.buffer);
};
export default getBuffer;
//# sourceMappingURL=dataUri.js.map