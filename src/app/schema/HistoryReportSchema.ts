import mongoose, { DocumentDefinition, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { IHistoryReport } from '../models/HistoryReportModel';

const reportIdTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const patientTypeOptions: SchemaTypeOptions<ObjectId> = {
    required: true,
    ref: 'patient',
};

const textTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    min: [10, 'Too short report text'],
    max: [1000, 'Too large report text'],
};

const schemaDefinition: SchemaDefinition<DocumentDefinition<undefined>> = {
    reportId: reportIdTypeOptions,
    patient: patientTypeOptions,
    text: textTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const PatientSchema: Schema<mongoose.Document<IHistoryReport>> = new Schema<mongoose.Document<IHistoryReport>>(schemaDefinition, schemaOptions);

export default PatientSchema;
