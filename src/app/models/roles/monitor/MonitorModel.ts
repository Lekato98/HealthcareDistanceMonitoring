import { SchemaOptions } from 'mongoose';
import { getModelForClass, ModelOptions, mongoose, Pre, Prop } from '@typegoose/typegoose';
import {
    ArrayPropOptions,
    BasePropOptions,
    IModelOptions,
    PropOptionsForString,
    Ref,
} from '@typegoose/typegoose/lib/types';
import { RoleName, User } from '../../user/UserModel';
import { Patient } from '../patient/PatientModel';
import MonitorModelUtils from './MonitorModelUtils';
import IRole from '../IRole';

const monitorIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const userIdTypeOptions: BasePropOptions = {
    type: () => String,
    ref: () => User,
    required: true,
    unique: true,
};

const activeTypeOptions: BasePropOptions = {
    type: Boolean,
    required: true,
    default: false,
};

const patientsTypeOptions: ArrayPropOptions = {
    type: () => [String],
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
class HealthcareMonitor implements IRole {
    @Prop(monitorIdTypeOptions) _id: string;
    @Prop(patientsTypeOptions) patients: Ref<Patient, string>[];
    @Prop(userIdTypeOptions) public userId: string;
    @Prop(activeTypeOptions) public active: boolean;

    constructor(payload: IRole) {
        if (payload) {
            this.userId = payload.userId;
            this.active = false;
        }
    }
}

interface IHealthcareMonitor extends IRole {
    _id: string;
    patients?: string[];
}

const MonitorModel = getModelForClass(HealthcareMonitor);

export {
    HealthcareMonitor,
    IHealthcareMonitor,
};
export default MonitorModel;
