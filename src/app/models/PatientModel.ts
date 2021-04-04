import { SchemaOptions } from 'mongoose';
import {
    AnyParamConstructor,
    BasePropOptions,
    IModelOptions,
    PropOptionsForString, Ref,
} from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, mongoose, Prop } from '@typegoose/typegoose';
import { User } from './UserModel';

export interface IPatient extends AnyParamConstructor<any>{
    patientId: string;
    user: Ref<User>;
}

const patientIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const userTypeOptions: BasePropOptions = {
    type: mongoose.Types.ObjectId,
    ref: 'user',
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'patient'
    }
};

@ModelOptions(modelOptions)
export class Patient {
    @Prop(patientIdTypeOptions) public patientId: string;
    @Prop(userTypeOptions) public user: Ref<User>;
}

const PatientModel = getModelForClass(Patient);

export default PatientModel;

