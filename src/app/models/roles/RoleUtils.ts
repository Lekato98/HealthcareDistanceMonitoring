import { RoleName } from '../user/UserModel';
import MentorService from './mentor/MentorService';
import DoctorService from './doctor/DoctorService';
import PatientService from './patient/PatientService';
import MentorModel from './mentor/MentorModel';
import DoctorModel from './doctor/DoctorModel';
import PatientModel from './patient/PatientModel';

class RoleUtils {
    public static getServiceByRoleName(roleName: string): any {
        switch (roleName) {
            case RoleName.MENTOR:
                return MentorService;

            case RoleName.DOCTOR:
                return DoctorService;

            case RoleName.PATIENT:
                return PatientService;

            default:
                throw new Error('Trying to get unknown role service');
        }
    }

    public static getModelByRoleName(roleName: string): any {
        switch (roleName) {
            case RoleName.MENTOR:
                return MentorModel;

            case RoleName.DOCTOR:
                return DoctorModel;

            case RoleName.PATIENT:
                return PatientModel;

            default:
                throw new Error('Trying to get unknown role model');
        }
    }

    public static getAllServices() {
        return [
            PatientService,
            MentorService,
            DoctorService,
        ];
    }
}

export default RoleUtils;
