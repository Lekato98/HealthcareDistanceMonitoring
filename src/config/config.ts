import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

export const config = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_SECRET: process.env.JWT_SECRET,
};
