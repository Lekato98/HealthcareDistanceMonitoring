import { RoleName } from '../user/UserModel';
import IRole from './IRole';
import { Monitor } from './monitor/MonitorModel';
import { Doctor } from './doctor/DoctorModel';
import { Patient } from './patient/PatientModel';

class RoleFactory {
    public static create(roleName: string, payload: IRole): IRole {
        switch (roleName) {
            case RoleName.MONITOR:
                return new Monitor(payload);

            case RoleName.DOCTOR:
                return new Doctor(payload);

            case RoleName.PATIENT:
                return new Patient(payload);

            default:
                throw new Error('Trying to create unknown role');
        }
    }

}

export default RoleFactory;
