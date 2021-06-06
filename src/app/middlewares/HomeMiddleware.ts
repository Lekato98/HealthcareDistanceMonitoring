import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../utils/HttpUtils';
import UserService from '../models/user/UserService';

@Injectable
class HomeMiddleware {
    public async isAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string = req.app.locals.jwt?._id;
            const nationalId: string = req.app.locals.jwt?.nationalId;
            const user = await UserService.findByNationalId(nationalId);
            if (user && user._id === userId) {
                next();
            } else {
                res.redirect('/auth/registration');
            }
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).render('500');
        }
    }
}

export default HomeMiddleware;
