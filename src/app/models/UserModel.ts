import mongoose from 'mongoose';
import UserSchema from '../schema/UserSchema';

export interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    gender: string;
    birthdate: Date;
    homeAddress: string;
    phoneNumber: string;
    password: string;
}

abstract class UserModel {
    public static readonly MODEL_NAME: string = 'user';
    public static readonly Model: mongoose.Model<IUser> = mongoose.model<IUser>(UserModel.MODEL_NAME, UserSchema);
}

export default UserModel;
