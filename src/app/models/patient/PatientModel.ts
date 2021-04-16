import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import { RoleName, User } from '../user/UserModel';
import PatientModelUtils from './PatientModelUtils';

const patientIdTypeOptions: PropOptionsForString = {
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

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: RoleName.PATIENT,
    },
};

@Pre<Patient>('validate', PatientModelUtils.preValidation)
@ModelOptions(modelOptions)
class Patient {
    @Prop(patientIdTypeOptions) public _id: string;
    @Prop(userIdTypeOptions) public userId: string;
}

interface IPatient {
    _id: string;
    userId?: string;
}

const PatientModel = getModelForClass(Patient);

export {
    Patient,
    IPatient,
};
export default PatientModel;
