import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { UNSUCCESSFUL } from '../helpers/constants';
import { HttpStatusCode } from '../utils/HttpUtils';
import MentorService from '../models/roles/mentor/MentorService';
import { RoleName } from '../models/user/UserModel';

@Injectable
class MentorMiddleware {
    public async isMentor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isAdmin: boolean = req.app.locals.isAdmin;

            if (isAdmin) {
                return next();
            }
            const userId: string = req.app.locals.jwt._id;
            const roleName: RoleName = req.app.locals.jwt.roleName;
            const mentor = roleName === RoleName.MENTOR && await MentorService.findOneByUserId(userId);

            if (mentor?.active) {
                req.app.locals.jwt.roleId = mentor._id;
                res.locals.role = RoleName.MENTOR;
                next();
            } else {
                const body = {success: UNSUCCESSFUL, message: 'Invalid action, looks like you are not a mentor!'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default MentorMiddleware;
