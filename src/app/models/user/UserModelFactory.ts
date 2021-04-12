import { DocumentType } from '@typegoose/typegoose';
import MonitorModel from '../monitor/MonitorModel';
import PatientModel from '../patient/PatientModel';
import { IUser, RoleName, User } from './UserModel';
import SpecialDoctorModel from '../doctor/DoctorModel';

export abstract class UserModelFactory {
    public static create(userInfo: IUser): DocumentType<User> {
        switch (userInfo.role) {
            case RoleName.PATIENT:
                return new PatientModel(userInfo);

            case RoleName.MONITOR:
                return new MonitorModel(userInfo);

            case RoleName.DOCTOR:
                return new SpecialDoctorModel(userInfo);

            default:
                throw new Error('Unknown Role');
        }
    }
}
