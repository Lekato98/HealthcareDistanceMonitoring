import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');

abstract class AuthMiddleware {
    public static async setAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        const token = req.headers['token'];
        try {
            //  req.headers['user'] = jwt.verify(token, process.env.JWT_SECRET);
            next();
        } catch (err) {
            console.log(err.message);
        }
    }
}

export default AuthMiddleware;
