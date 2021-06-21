import { SchemaOptions } from 'mongoose';
import { getModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import { BasePropOptions, IModelOptions, PropOptionsForString, Ref } from '@typegoose/typegoose/lib/types';
import { Patient } from '../../roles/patient/PatientModel';
import HistoryReportModelHooks from './HistoryReportModelHooks';

const historyIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const patientTypeOptions: BasePropOptions = {
    type: () => String,
    required: true,
    ref: () => Patient,
    unique: true,
};

const textTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    minlength: [10, 'Too short report text'],
    maxlength: [1000, 'Too large report text'],
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'history_report',
    },
};

@Pre<HistoryReport>('validate', HistoryReportModelHooks.preValidate)
@ModelOptions(modelOptions)
export class HistoryReport {
    @Prop(historyIdTypeOptions) _id: string;
    @Prop(patientTypeOptions) patient: Ref<Patient, string>;
    @Prop(textTypeOptions) text: string;

    constructor(payload: IHistory) {
        if (payload.patient) {
            this.patient = payload.patient;
        }

        this.text = payload.text;
    }
}

export interface IHistory {
    _id?: string;
    patient: string;
    text: string;
}

const HistoryReportModel = getModelForClass(HistoryReport);

export default HistoryReportModel;
