import { NextFunction, Request, Response } from 'express';
import JWTUtils from '../utils/JWTUtils';
import { HttpStatusCode } from '../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';

const jwt = require('jsonwebtoken');

@Injectable
class AuthMiddleware {
    // global middleware
    public async setAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.cookies[JWTUtils.JWT_COOKIE_NAME];
            res.locals.jwt = jwt.verify(token, process.env.JWT_SECRET);
        } catch (e) {
            delete res.locals.jwt;
        } finally {
            next();
        }
    }

    public isAuth(req: Request, res: Response, next: NextFunction): void {
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
