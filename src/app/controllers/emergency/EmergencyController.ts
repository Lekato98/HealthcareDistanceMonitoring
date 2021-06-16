import {Injectable} from 'dependency-injection-v1';
import {Request, Response} from 'express';
import {SUCCESS, UNSUCCESSFUL} from '../../helpers/constants';
import {HttpStatusCode} from '../../utils/HttpUtils';
import EmergencyService from '../../models/emergency/EmergencyService';
import SocketIO, {INotificationMessage} from "../../io/SocketIO";

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
            const nationalId = req.app.locals.jwt.nationalId;
            const payload = {...req.body, patient: patientId};
            const emergencyCase = await EmergencyService.create(payload);
            const body = {success: SUCCESS, emergencyCase};
            const message: INotificationMessage = {
                title: 'Emergency Case',
                body: `National Id: ${nationalId}`,
                type: 'danger',
                date: new Date(),
                redirectUrl: '/emergency-cases',
            };

            SocketIO.emitDoctorAndMentors(message);
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async hospitalize(req: Request, res: Response): Promise<void> {
        try {
            const {emergencyId} = req.params;
            await EmergencyService.delete(emergencyId);
            const body = {success: SUCCESS, message: 'Waiting for hospital response'};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async removeCase(req: Request, res: Response): Promise<void> {
        try {
            const {emergencyId} = req.params;
            await EmergencyService.delete(emergencyId);
            const body = {success: SUCCESS, message: 'Removed successfully'};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default EmergencyController;
