import { SchemaOptions } from 'mongoose';
import { getDiscriminatorModelForClass, ModelOptions, mongoose, Pre, Prop } from '@typegoose/typegoose';
import { ArrayPropOptions, IModelOptions, PropOptionsForString, Ref } from '@typegoose/typegoose/lib/types';
import UserModel, { IUser, RoleName, User } from '../user/UserModel';
import { Patient } from '../patient/PatientModel';
import { nanoid } from 'nanoid';
import MonitorModelUtils from './MonitorModelUtils';

const monitorIdTypeOptions: PropOptionsForString = {
    type: String,
    unique: true,
    required: true,
    trim: true,
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

@Pre<HealthcareMonitor>('validate', MonitorModelUtils.preValidate)
@ModelOptions(modelOptions)
class HealthcareMonitor extends User {
    @Prop(monitorIdTypeOptions) monitorId: string;
    @Prop(patientsTypeOptions) patients: Ref<Patient>[];
}

interface IHealthcareMonitor extends IUser {
    monitorId: string;
    patients?: mongoose.Types.ObjectId[];
}

const MonitorModel = getDiscriminatorModelForClass(UserModel, HealthcareMonitor);

export {
    HealthcareMonitor,
    IHealthcareMonitor,
};
export default MonitorModel;
