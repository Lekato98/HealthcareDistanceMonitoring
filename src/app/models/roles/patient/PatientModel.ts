import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import { RoleName, User } from '../../user/UserModel';
import PatientModelUtils from './PatientModelUtils';
import IRole, { Status } from '../IRole';
import DateUtils from '../../../utils/DateUtils';
import { Monitor } from '../monitor/MonitorModel';

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

const expectedRecoveryDateTypeOptions: BasePropOptions = {
    type: Date,
    default: Date.now,
};

const nextDailyReportDateTypeOptions: BasePropOptions = {
    type: Date,
    default: Date.now,
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
    @Prop(expectedRecoveryDateTypeOptions) public expectedRecoveryDate: Date;
    @Prop(nextDailyReportDateTypeOptions) public nextDailyReportDate: Date;

    constructor(payload: IRole) {
        if (payload) {
            this._id = payload._id;
            this.userId = payload.userId;
        }

        this.expectedRecoveryDate = DateUtils.getDayReportTimeAfterNDays(14); // 14 -> 2 weeks
        this.nextDailyReportDate = DateUtils.getDayReportTimeAfterNDays(0); // 0 -> Today
    }
}

export interface IPatient extends IRole {
    _id: string;
}

const PatientModel = getModelForClass(Patient);

export default PatientModel;
