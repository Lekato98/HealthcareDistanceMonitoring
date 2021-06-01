import { Injectable } from 'dependency-injection-v1';
import { SUCCESS, UNSUCCESSFUL } from '../../../helpers/constants';
import { HttpStatusCode } from '../../../utils/HttpUtils';
import { Request, Response } from 'express';
import PatientService from '../../../models/roles/patient/PatientService';

@Injectable
class PatientController {
    /***
     * @Route /api/v1/patient/:userId
     * @Get
     */
    public async getPatientByUserId(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = req.params;
            const patient = await PatientService.findPatientByUserId(userId);
            if (patient) {
                const body = {success: SUCCESS, patient};
                res.json(body);
            } else {
                const body = {success: UNSUCCESSFUL, message: 'error 404 patient not found'};
                res.status(HttpStatusCode.NOT_FOUND).json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /***
     * @Route /api/v1/patient/all?page=
     * @Get
     */
    public async getPatientsByPageNumber(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber: number = Number(req.query.page) || 0;
            const patients = await PatientService.getPatientsByPageNumber(pageNumber);
            const body = {success: SUCCESS, patients};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /***
     * @Route /api/v1/patient/monitored
     * @Get
     */
    public async getMonitoredPatientsByPageNumber(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber: number = Number(req.query.page) || 0;
            const patients = await PatientService.getMonitoredPatientsByPageNumber(pageNumber);
            const body = {success: SUCCESS, patients};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /***
     * @Route /api/v1/patient/unmonitored
     * @Get
     */
    public async getUnmonitoredPatientsByPageNumber(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber: number = Number(req.query.page) || 0;
            const patients = await PatientService.getUnmonitoredPatientsByPageNumber(pageNumber);
            const body = {success: SUCCESS, patients};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /***
     * @Route /api/v1/patient/search?nationalId=
     * @Get
     */
    public async searchPatients(req: Request, res: Response): Promise<void> {
        try {
            const textToSearch: string = String(req.query.nationalId || '').trim();
            const patients = await PatientService.searchPatients(textToSearch);
            const body = {success: SUCCESS, patients};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default PatientController;
