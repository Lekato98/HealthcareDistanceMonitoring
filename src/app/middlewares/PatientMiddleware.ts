import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';

@Injectable
class PatientMiddleware {
    public isDailyReportAvailable(req: Request, res: Response, next: NextFunction): void {
        console.log('available daily report');
        next();
    }
}

export default PatientMiddleware;
