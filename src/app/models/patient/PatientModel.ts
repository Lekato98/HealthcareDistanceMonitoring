import { SchemaOptions } from 'mongoose';
import { IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getDiscriminatorModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import UserModel, { IUser, RoleName, User } from '../user/UserModel';
import { nanoid } from 'nanoid';
import PatientModelUtils from './PatientModelUtils';


const patientIdTypeOptions: PropOptionsForString = {
    type: String,
    unique: true,
    required: true,
    trim: true,
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
class Patient extends User {
    @Prop(patientIdTypeOptions) public patientId: string;
}

interface IPatient extends IUser {
    patientId: string;
}

const PatientModel = getDiscriminatorModelForClass(UserModel, Patient);

export {
    Patient,
    IPatient,
};
export default PatientModel;
