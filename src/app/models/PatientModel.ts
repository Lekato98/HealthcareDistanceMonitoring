import mongoose from 'mongoose';
import PatientSchema from '../schema/PatientSchema';
import { IUser } from './UserModel';

export interface IPatient extends mongoose.Document {
    patientId: string;
    user: IUser['_id'];
}

abstract class PatientModel {
    public static readonly MODEL_NAME: string = 'patient';
    public static readonly Model: mongoose.Model<IPatient> = mongoose.model<IPatient>(
        PatientModel.MODEL_NAME, PatientSchema
    );
}

export default PatientModel;
