import { NextFunction, Request, Response } from 'express';
import JWTUtils from '../utils/JWTUtils';
import { HttpStatusCode } from '../utils/HttpUtils';

const jwt = require('jsonwebtoken');

abstract class AuthMiddleware {
    public static async setAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.cookies[JWTUtils.JWT_COOKIE_NAME];
            res.locals.user = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.log(err.message);
        } finally {
            next();
        }
    }

    public static auth(req: Request, res: Response, next: NextFunction): void {
        if (res.locals.user) {
            next();
        } else {
            res.status(HttpStatusCode.UNAUTHORIZED);
        }
    }
}

export default AuthMiddleware;
