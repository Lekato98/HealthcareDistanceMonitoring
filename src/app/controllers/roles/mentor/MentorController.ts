import {Injectable} from 'dependency-injection-v1';
import {Request, Response} from 'express';
import {SUCCESS, UNSUCCESSFUL} from '../../../helpers/constants';
import {HttpStatusCode} from '../../../utils/HttpUtils';
import MentorService from '../../../models/roles/mentor/MentorService';
import SocketIO, {INotificationMessage} from "../../../io/SocketIO";

@Injectable
class MentorController {
    /**
     * @Route /api/v1/mentor/add-patient
     * @Post
     * */
    public async addPatient(req: Request, res: Response): Promise<void> {
        try {
            const mentorId = req.app.locals.jwt.roleId;
            const patientId = req.body.patientId;
            const monitoredPatient = await MentorService.addPatient(mentorId, patientId);
            const body = {success: SUCCESS, monitoredPatient};
            res.json(body);
        } catch (e: any) {
            if (e.message.startsWith('E11000')) {
                const body = {success: UNSUCCESSFUL, message: 'Patient is already monitored by mentor'};
                res.status(HttpStatusCode.BAD_REQUEST).json(body);
            } else {
                const body = {success: UNSUCCESSFUL, message: e.message};
                res.status(HttpStatusCode.SERVER_ERROR).json(body);
            }
        }
    }

    /**
     * @Route /api/v1/mentor/remove-patient
     * @PATCH
     * */
    public async removePatient(req: Request, res: Response): Promise<void> {
        try {
            const mentorId = req.app.locals.jwt.roleId;
            const patientId = req.body.patientId;
            const removedPatient = await MentorService.removePatient(mentorId, patientId);
            const body = {success: SUCCESS, removedPatient};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/mentor/my-patients
     * @GET
     * */
    public async getMyPatients(req: Request, res: Response): Promise<void> {
        try {
            const mentorId = req.app.locals.jwt.roleId;
            const patients = await MentorService.getMyPatients(mentorId);
            const body = {success: SUCCESS, patients};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/mentor/advice
     * @GET
     * */
    public async updateAdvice(req: Request, res: Response): Promise<void> {
        try {
            const mentorId = req.app.locals.jwt.roleId;
            const {text} = req.body;
            await MentorService.updateAdvice(mentorId, text);
            const patients = await MentorService.getMyPatients(mentorId);
            const message: INotificationMessage = {
                title: 'New Advice By Mentor',
                body: text.substr(0, 10) + '...',
                type: 'default',
                date: new Date(),
                redirectUrl: '/',
            };

            patients.forEach(({user: {_id}}: any) => SocketIO.notifyUser(_id, message));
            const body = {success: SUCCESS, text, message: 'Advice updated successfully'};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

}

export default MentorController;
