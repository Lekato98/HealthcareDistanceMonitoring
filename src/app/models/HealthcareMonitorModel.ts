import mongoose from 'mongoose';
import HealthcareMonitorSchema from '../schema/HealthcareMonitorSchema';
import { IUser } from './UserModel';
import { IPatient } from './PatientModel';

export interface IHealthcareMonitor extends mongoose.Document {
    monitorId: string;
    user: IUser['_id'];
    patients: [IPatient['_id']];
}

abstract class HealthcareMonitorModel {
    public static readonly MODEL_NAME: string = 'healthcareMonitor';
    public static readonly Model: mongoose.Model<IHealthcareMonitor> = mongoose.model<IHealthcareMonitor>(
        HealthcareMonitorModel.MODEL_NAME, HealthcareMonitorSchema
    );
}

export default HealthcareMonitorModel;
