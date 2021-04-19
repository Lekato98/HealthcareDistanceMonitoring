import { RoleName } from '../user/UserModel';
import MonitorService from './monitor/MonitorService';
import DoctorService from './doctor/DoctorService';
import PatientService from './patient/PatientService';
import MonitorModel from './monitor/MonitorModel';
import DoctorModel from './doctor/DoctorModel';
import PatientModel from './patient/PatientModel';

class RoleUtils {
    public static getServiceByRoleName(roleName: string): any {
        switch (roleName) {
            case RoleName.MONITOR:
                return MonitorService;

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
            case RoleName.MONITOR:
                return MonitorModel;

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
            MonitorService,
            DoctorService,
        ];
    }
}

export default RoleUtils;
