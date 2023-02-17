import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { UNSUCCESSFUL } from '../helpers/constants';
import { HttpStatusCode } from '../utils/HttpUtils';
import DoctorService from '../models/roles/doctor/DoctorService';
import { RoleName } from '../models/user/UserModel';

@Injectable
class DoctorMiddleware {
    public static async isDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isAdmin: boolean = req.app.locals.isAdmin;

            if (isAdmin) {
                return next();
            }

            const userId: string = req.app.locals.jwt._id;
            const roleName: RoleName = req.app.locals.jwt.roleName;
            const doctor = roleName === RoleName.DOCTOR && await DoctorService.findOneByUserId(userId);

            if (doctor?.active) {
                req.app.locals.jwt.roleId = doctor._id;
                res.locals.role = RoleName.DOCTOR;
                next();
            } else {
                const body = {success: UNSUCCESSFUL, message: 'Invalid action, looks like you are not a doctor!'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            }
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default DoctorMiddleware;
