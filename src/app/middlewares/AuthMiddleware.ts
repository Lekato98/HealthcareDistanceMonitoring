import { NextFunction, Request, Response } from 'express';
import JWTUtils from '../utils/JWTUtils';
import { HttpStatusCode } from '../utils/HttpUtils';

const jwt = require('jsonwebtoken');

class AuthMiddleware {
    // global middleware
    public static async setAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.cookies[JWTUtils.JWT_COOKIE_NAME];
            res.locals.jwt = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            console.error(`~SetAuth ${e.message}`);
            delete res.locals.jwt;
        } finally {
            next();
        }
    }

    public static isAuth(req: Request, res: Response, next: NextFunction): void {
        // setAuth is a global middleware which sets the exist decoded token in res.locals.jwt
        // so we have to check only if the jwt is exist
        if (res.locals.jwt) {
            next();
        } else {
            const body = {success: 0, message: 'Unauthorized'};
            res.status(HttpStatusCode.UNAUTHORIZED).json(body);
        }
    }
}

export default AuthMiddleware;
