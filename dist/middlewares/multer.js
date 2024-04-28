import multer from "multer";
import { v4 as uuid } from "uuid";
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        const id = uuid();
        const extension = file.originalname.split(".").pop();
        const filename = `${id}.${extension}`;
        callback(null, filename);
    },
});
export const uploadSingleImage = multer({ storage }).single("productImage");
