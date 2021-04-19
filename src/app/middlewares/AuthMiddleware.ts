import { NextFunction, Request, Response } from 'express';
import JWTUtils from '../utils/JWTUtils';
import { HttpStatusCode } from '../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';
import UserService from '../models/user/UserService';

const jwt = require('jsonwebtoken');

@Injectable
class AuthMiddleware {
    // global middleware
    public async setAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = req.cookies[JWTUtils.JWT_COOKIE_NAME];
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const projection = '-password';
            const user = await UserService.findByNationalId(decodedToken.nationalId, projection);

            if (user && user._id === decodedToken._id && user.nationalId === decodedToken.nationalId) {
                res.locals.jwt = decodedToken;
            }
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
