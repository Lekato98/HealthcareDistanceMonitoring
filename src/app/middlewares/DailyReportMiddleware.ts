import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import PatientService from '../models/roles/patient/PatientService';
import { HttpStatusCode } from '../utils/HttpUtils';
import { UNSUCCESSFUL } from '../helpers/constants';

@Injectable
class DailyReportMiddleware {
    public async isDailyReportAvailable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.app.locals.jwt._id;
            const patient = await PatientService.findOneByUserId(userId);

            if (patient?.nextDailyReportDate) {
                const targetDate = patient.nextDailyReportDate.getTime();
                const currentDate = new Date().getTime();

                if (currentDate - targetDate >= 0) {
                    next();
                } else {
                    const body = {
                        success: UNSUCCESSFUL,
                        message: `Your next daily report will be available in ${ patient.nextDailyReportDate }`,
                    };
                    res.status(HttpStatusCode.FORBIDDEN).json(body);
                }
            } else {
                const body = {success: UNSUCCESSFUL, message: 'its looks like you don\'t have permission'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            }
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default DailyReportMiddleware;
