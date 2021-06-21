import { RoleName } from '../user/UserModel';
import IRole from './IRole';
import { Mentor } from './mentor/MentorModel';
import { Doctor } from './doctor/DoctorModel';
import { Patient } from './patient/PatientModel';

class RoleFactory {
    public static create(roleName: string, payload: IRole): IRole {
        switch (roleName) {
            case RoleName.MENTOR:
                return new Mentor(payload);

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
