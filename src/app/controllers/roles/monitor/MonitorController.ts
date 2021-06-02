import { Injectable } from 'dependency-injection-v1';
import { Request, Response } from 'express';
import { SUCCESS, UNSUCCESSFUL } from '../../../helpers/constants';
import { HttpStatusCode } from '../../../utils/HttpUtils';
import MonitorService from '../../../models/roles/monitor/MonitorService';

@Injectable
class MonitorController {
    /**
     * @Route /api/v1/monitor/add-patient
     * @Post
     * */
    public async addPatient(req: Request, res: Response): Promise<void> {
        try {
            const monitorId = req.app.locals.jwt.roleId;
            const patientId = req.body.patientId;
            const monitoredPatient = await MonitorService.addPatient(monitorId, patientId);
            const body = {success: SUCCESS, monitoredPatient};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

}

export default MonitorController;
