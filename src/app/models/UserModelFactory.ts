import { DocumentType } from '@typegoose/typegoose';
import HealthcareMonitorModel from './HealthcareMonitorModel';
import PatientModel from './PatientModel';
import { IUser, RoleName, User } from './UserModel';
import SpecialDoctorModel from './SpecialDoctorModel';

export abstract class UserModelFactory {
    public static create(role: RoleName, userInfo: IUser): DocumentType<User> {
        switch (role) {
            case RoleName.PATIENT:
                return new PatientModel(userInfo);

            case RoleName.MONITOR:
                return new HealthcareMonitorModel(userInfo);

            case RoleName.DOCTOR:
                return new SpecialDoctorModel(userInfo);

            default:
                throw new Error('Unknown Role');
        }
    }
}
