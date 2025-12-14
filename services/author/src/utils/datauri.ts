import DataUriParser from "datauri/parser.js";
import path from "path"

const getBuffer = (file: any) => {
    const parser = new DataUriParser()
    const extenstionName = path.extname(file.originalname).toString()
    return parser.format(extenstionName, file.buffer)
}

export default getBuffer