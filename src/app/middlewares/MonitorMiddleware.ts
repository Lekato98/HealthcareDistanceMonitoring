import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { UNSUCCESSFUL } from '../helpers/constants';
import { HttpStatusCode } from '../utils/HttpUtils';
import MonitorService from '../models/roles/monitor/MonitorService';
import { RoleName } from '../models/user/UserModel';

@Injectable
class MonitorMiddleware {
    public async isMonitor(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId: string = req.app.locals.jwt._id;
            const roleName: RoleName = req.app.locals.jwt.roleName;
            const monitor = roleName === RoleName.MONITOR && await MonitorService.findOneByUserId(userId);

            if (monitor?.active) {
                req.app.locals.jwt.roleId = monitor._id;
                res.locals.role = RoleName.MONITOR;
                next();
            } else {
                const body = {success: UNSUCCESSFUL, message: 'Invalid action, looks like you are not a monitor!'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default MonitorMiddleware;
