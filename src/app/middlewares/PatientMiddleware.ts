import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { UNSUCCESSFUL } from '../helpers/constants';
import { HttpStatusCode } from '../utils/HttpUtils';
import PatientService from '../models/roles/patient/PatientService';
import { RoleName } from '../models/user/UserModel';

@Injectable
class PatientMiddleware {
    public async isPatient(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const isAdmin: boolean = req.app.locals.isAdmin;

            if (isAdmin) {
                return next();
            }

            const userId: string = req.app.locals.jwt._id;
            const roleName: RoleName = req.app.locals.jwt.roleName;
            const patient = roleName === RoleName.PATIENT && await PatientService.findOneByUserId(userId);

            if (patient?.active) {
                req.app.locals.jwt.roleId = patient._id;
                res.locals.role = RoleName.PATIENT;
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
