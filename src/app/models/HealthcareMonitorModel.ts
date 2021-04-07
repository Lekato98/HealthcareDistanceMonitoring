import { SchemaOptions } from 'mongoose';
import { getDiscriminatorModelForClass, ModelOptions, mongoose, Prop } from '@typegoose/typegoose';
import { ArrayPropOptions, IModelOptions, PropOptionsForString, Ref } from '@typegoose/typegoose/lib/types';
import UserModel, { IUser, RoleName, User } from './UserModel';
import { Patient } from './PatientModel';

const monitorIdTypeOptions: PropOptionsForString = {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Monitor id'],
    minlength: [6, 'Too short Monitor id'],
};

const patientsTypeOptions: ArrayPropOptions = {
    type: () => [Patient],
    ref: () => Patient,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: RoleName.MONITOR,
    },
};

@ModelOptions(modelOptions)
class HealthcareMonitor extends User {
    @Prop(monitorIdTypeOptions) monitorId: string;
    @Prop(patientsTypeOptions) patients: Ref<Patient>[];
}

interface IHealthcareMonitor extends IUser {
    monitorId: string;
    patients?: mongoose.Types.ObjectId[];
}

const HealthcareMonitorModel = getDiscriminatorModelForClass(UserModel, HealthcareMonitor);

export {
    HealthcareMonitor,
    IHealthcareMonitor,
};
export default HealthcareMonitorModel;
