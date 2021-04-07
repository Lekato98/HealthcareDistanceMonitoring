import { SchemaOptions } from 'mongoose';
import { IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getDiscriminatorModelForClass, ModelOptions, Prop } from '@typegoose/typegoose';
import UserModel, { IUser, RoleName, User } from './UserModel';


const patientIdTypeOptions: PropOptionsForString = {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
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
