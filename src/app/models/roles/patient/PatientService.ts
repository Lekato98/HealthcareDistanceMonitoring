import PatientModel, { IPatient, Patient } from './PatientModel';
import { DocumentType } from '@typegoose/typegoose';
import { Status } from '../IRole';
import { ACTIVE } from '../../../helpers/constants';

class PatientService {
    public static async create(payload: IPatient): Promise<DocumentType<Patient>> {
        const patient = new Patient(payload);
        patient.active = ACTIVE;
        patient.status = Status.ACCEPTED;
        return PatientModel.create(patient);
    }

    public static async deleteOneByUserId(userId: string): Promise<DocumentType<Patient>> {
        return PatientModel.findOneAndDelete({userId});
    }
}

export default PatientService;
