import PatientModel, { IPatient, Patient } from './PatientModel';
import { DocumentType } from '@typegoose/typegoose';

class PatientService {
    public static async create(payload: IPatient): Promise<DocumentType<Patient>> {
        const patient = new Patient(payload);
        return PatientModel.create(patient);
    }

    public static async deleteOneByUserId(userId: string): Promise<DocumentType<Patient>> {
        return PatientModel.findOneAndDelete({userId});
    }
}

export default PatientService;
