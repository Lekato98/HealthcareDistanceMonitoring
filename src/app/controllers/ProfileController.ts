import { Request, Response } from 'express';
import PatientModel, { IPatient, Patient } from '../models/PatientModel';
import HealthcareMonitorModel, { HealthcareMonitor, IHealthcareMonitor } from '../models/HealthcareMonitorModel';
import DoctorModel, { IDoctor, SpecialDoctor } from '../models/SpecialDoctorModel';
import { HttpStatusCode } from '../utils/HttpUtils';
import { DocumentType } from '@typegoose/typegoose';

class ProfileController {
    public async profilePage(req: Request, res: Response): Promise<void> {
        res.render('profile');
    }

    public async createPatientProfile(req: Request<any, any, IPatient>, res: Response): Promise<void> {
        try {
            // const patientInfo: IPatient = {patientId: '1', user: res.locals.user._id};
            const patient: DocumentType<Patient> = await PatientModel.create({});
            const body = {success: 1, patient};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async createMonitorProfile(req: Request<any, any, IHealthcareMonitor>, res: Response): Promise<void> {
        try {
            const monitorInfo: IHealthcareMonitor = {monitorId: '1', user: res.locals.user._id};
            const monitor: DocumentType<HealthcareMonitor> = await HealthcareMonitorModel.create(monitorInfo);
            const body = {success: 1, monitor};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async createDoctorProfile(req: Request<any, any, IDoctor>, res: Response): Promise<void> {
        try {
            const doctorInfo: IDoctor = {doctorId: '1', user: res.locals.user._id};
            const doctor: DocumentType<SpecialDoctor> = await DoctorModel.create(doctorInfo);
            const body = {success: 1, doctor};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

const profileController = new ProfileController();

export default profileController;
