import { RoleName } from '../user/UserModel';
import IRole from './IRole';
import MonitorModel, { HealthcareMonitor } from './monitor/MonitorModel';
import DoctorModel, { SpecialDoctor } from './doctor/DoctorModel';
import PatientModel, { Patient } from './patient/PatientModel';
import { DocumentType } from '@typegoose/typegoose';

class RoleFactory {
    public static create(roleName: RoleName, payload: IRole): DocumentType<IRole> {
        switch (roleName) {
            case RoleName.MONITOR:
                const monitor = new HealthcareMonitor(payload);
                return new MonitorModel(monitor);

            case RoleName.DOCTOR:
                const doctor = new SpecialDoctor(payload);
                return new DoctorModel(doctor);

            case RoleName.PATIENT:
                const patient = new Patient(payload);
                return new PatientModel(patient);

            default:
                throw new Error('Trying to create unknown role');
        }
    }
}

export default RoleFactory;
