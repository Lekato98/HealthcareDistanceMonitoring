import mongoose from 'mongoose';
import SpecialDoctorSchema from '../schema/SpecialDoctorSchema';
import { IUser } from './UserModel';

export interface ISpecialDoctor extends mongoose.Document {
    doctorId: string;
    user: IUser['_id'];
}

abstract class SpecialDoctorModel {
    public static readonly MODEL_NAME: string = 'patient';
    public static readonly Model: mongoose.Model<ISpecialDoctor> = mongoose.model<ISpecialDoctor>(
        SpecialDoctorModel.MODEL_NAME, SpecialDoctorSchema
    );

}

export default SpecialDoctorModel;
