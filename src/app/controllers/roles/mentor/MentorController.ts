import { Injectable } from 'dependency-injection-v1';
import { Request, Response } from 'express';
import { SUCCESS, UNSUCCESSFUL } from '../../../helpers/constants';
import { HttpStatusCode } from '../../../utils/HttpUtils';
import MentorService from '../../../models/roles/mentor/MentorService';

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
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
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
        } catch (e) {
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
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

}

export default MentorController;
