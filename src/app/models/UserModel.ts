import mongoose from 'mongoose';
import UserSchema from '../schema/UserSchema';

abstract class UserModel {
    public static readonly MODEL_NAME: string = 'user';
    public static readonly Model: mongoose.Model<any> = mongoose.model(UserModel.MODEL_NAME, UserSchema);
}

export default UserModel;
