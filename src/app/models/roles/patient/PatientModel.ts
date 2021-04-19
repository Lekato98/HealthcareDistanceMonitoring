import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import { RoleName, User } from '../../user/UserModel';
import PatientModelUtils from './PatientModelUtils';
import IRole, { Status } from '../IRole';

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

const activeTypeOptions: BasePropOptions = {
    type: Boolean,
    required: true,
    default: true,
};

const statusTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: [Status.ACCEPTED, Status.PENDING, Status.REJECTED],
    default: Status.ACCEPTED,
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
export class Patient implements IRole {
    @Prop(patientIdTypeOptions) public _id: string;
    @Prop(userIdTypeOptions) public userId: string;
    @Prop(activeTypeOptions) public active: boolean;
    @Prop(statusTypeOptions) public status: string;

    constructor(payload: IRole) {
        if (payload) {
            this.userId = payload.userId;
        }
    }
}

export interface IPatient extends IRole {
    _id: string;
}

const PatientModel = getModelForClass(Patient);

export default PatientModel;
