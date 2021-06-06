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

    /**
     * @Route /api/v1/monitor/remove-patient
     * @PATCH
     * */
    public async removePatient(req: Request, res: Response): Promise<void> {
        try {
            const monitorId = req.app.locals.jwt.roleId;
            const patientId = req.body.patientId;
            const removedPatient = await MonitorService.removePatient(monitorId, patientId);
            const body = {success: SUCCESS, removedPatient};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/monitor/my-patients
     * @GET
     * */
    public async getMyPatients(req: Request, res: Response): Promise<void> {
        try {
            const monitorId = req.app.locals.jwt.roleId;
            const patients = await MonitorService.getMyPatients(monitorId);
            const body = {success: SUCCESS, patients};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

}

export default MonitorController;
