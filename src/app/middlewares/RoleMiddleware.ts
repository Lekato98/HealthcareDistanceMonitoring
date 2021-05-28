import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { UNSUCCESSFUL } from '../helpers/constants';
import { HttpStatusCode } from '../utils/HttpUtils';

@Injectable
class RoleMiddleware {
    public isPatient(req: Request, res: Response, next: NextFunction): void {

    }

    public isMonitor(req: Request, res: Response, next: NextFunction): void {

    }

    public isDoctor(req: Request, res: Response, next: NextFunction): void {

    }

    public async isValidRole(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.messageType};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default RoleMiddleware;
