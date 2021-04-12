import { SchemaOptions } from 'mongoose';
import { getModelForClass, ModelOptions, mongoose, Prop } from '@typegoose/typegoose';
import {
    BasePropOptions,
    IModelOptions,
    PropOptionsForString,
    Ref,
} from '@typegoose/typegoose/lib/types';
import { Patient } from '../../patient/PatientModel';

const reportIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const patientTypeOptions: BasePropOptions = {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'patient',
};

const textTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    min: [10, 'Too short report text'],
    max: [1000, 'Too large report text'],
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'report',
    },
};

@ModelOptions(modelOptions)
class HistoryReport {
    @Prop(reportIdTypeOptions) historyId: string;
    @Prop(patientTypeOptions) patient: Ref<Patient>;
    @Prop(textTypeOptions) text: string;
}

const HistoryReportModel = getModelForClass(HistoryReport);

export default HistoryReportModel;
