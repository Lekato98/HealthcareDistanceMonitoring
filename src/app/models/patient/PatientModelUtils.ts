import { nanoid } from 'nanoid';
import { Patient } from './PatientModel';

class PatientModelUtils {
    public static async preValidation(this: Patient): Promise<void> {
        this.patientId = `patient~${ nanoid() }`;
    }
}

export default PatientModelUtils;
