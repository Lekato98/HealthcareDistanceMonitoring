import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { UNSUCCESSFUL } from '../helpers/constants';
import { HttpStatusCode } from '../utils/HttpUtils';
import PatientService from '../models/roles/patient/PatientService';

@Injectable
class PatientMiddleware {
    public async isPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string = req.app.locals.jwt._id;
            if (await PatientService.isExistByUserId(userId)) {
                next();
            } else {
                const body = {success: UNSUCCESSFUL, message: 'Invalid action, looks like you are not a patient!'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default PatientMiddleware;
