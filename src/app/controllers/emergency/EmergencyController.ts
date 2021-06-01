import { Injectable } from 'dependency-injection-v1';
import { Request, Response } from 'express';
import { SUCCESS, UNSUCCESSFUL } from '../../helpers/constants';
import { HttpStatusCode } from '../../utils/HttpUtils';
import EmergencyService from '../../models/emergency/EmergencyService';

@Injectable
class EmergencyController {
    public async getAll(req: Request, res: Response): Promise<void> {
        try {
            const emergencyCases = await EmergencyService.getAll();
            const body = {success: SUCCESS, emergencyCases};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async createEmergencyCase(req: Request, res: Response): Promise<void> {
        try {
            const patientId = req.app.locals.jwt.roleId;
            const payload = {...req.body, patient: patientId};
            const emergencyCase = await EmergencyService.create(payload);
            const body = {success: SUCCESS, emergencyCase};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default EmergencyController;
