import { SchemaOptions } from 'mongoose';
import { getModelForClass, ModelOptions, mongoose, Prop } from '@typegoose/typegoose';
import {
    ArrayPropOptions,
    BasePropOptions,
    IModelOptions,
    PropOptionsForString,
    Ref,
} from '@typegoose/typegoose/lib/types';
import { User } from './UserModel';
import { Patient } from './PatientModel';

const monitorIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Monitor id'],
    minlength: [6, 'Too short Monitor id'],
};

const userTypeOptions: BasePropOptions = {
    type: mongoose.Types.ObjectId,
    ref: 'user',
};

const patientsTypeOptions: ArrayPropOptions = {
    type: [mongoose.Types.ObjectId],
    ref: 'patient',
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'healthcare_monitor',
    },
};

export interface IHealthcareMonitor {
    monitorId: string;
    user: Ref<User>;
    patients: Ref<Patient>[];
}

@ModelOptions(modelOptions)
export class HealthcareMonitor {
    @Prop(monitorIdTypeOptions) monitorId: string;
    @Prop(userTypeOptions) user: Ref<User>;
    @Prop(patientsTypeOptions) patients: Ref<Patient>[];
}

const HealthcareMonitorModel = getModelForClass(HealthcareMonitor);

export default HealthcareMonitorModel;
