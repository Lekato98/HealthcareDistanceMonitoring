import mongoose from 'mongoose';
import SystemAdminSchema from '../schema/SystemAdminSchema';

export interface ISystemAdmin extends mongoose.Document {
    adminId: string;
    password: string;
}

abstract class SystemAdminModel {
    public static readonly MODEL_NAME: string = 'patient';
    public static readonly Model: mongoose.Model<ISystemAdmin> = mongoose.model<ISystemAdmin>(
        SystemAdminModel.MODEL_NAME, SystemAdminSchema
    );
}

export default SystemAdminModel;
