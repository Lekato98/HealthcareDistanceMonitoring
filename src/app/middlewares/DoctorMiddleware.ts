import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { SUCCESS, UNSUCCESSFUL } from '../helpers/constants';
import { HttpStatusCode } from '../utils/HttpUtils';
import DoctorService from '../models/roles/doctor/DoctorService';

@Injectable
class DoctorMiddleware {
    public static async isDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string = req.app.locals.jwt._id;
            if (await DoctorService.isExistByUserId(userId)) {
                next();
            } else {
                const body = {success: UNSUCCESSFUL, message: 'Invalid action, looks like you are not a doctor!'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default DoctorMiddleware;
