import * as dotenv from 'dotenv';
const multer = require('multer');

const UPLOAD_DESTINATION = './src/uploads';

const storage = multer.diskStorage({destination: UPLOAD_DESTINATION, filename: filenameHandler});
const upload = multer({storage: storage});

dotenv.config({path: __dirname + '/.env'});

export const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    UPLOAD: upload,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

function filenameHandler(req: any, file: { fieldname: string, mimetype: string }, cb: (arg0: any, arg1: string) => void) {
    cb(null, file.fieldname + '-' + Date.now() + '.' + file.mimetype.split('/')[1]);
}
