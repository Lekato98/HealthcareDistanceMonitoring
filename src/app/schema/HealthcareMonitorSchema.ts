import mongoose, { DocumentDefinition, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { IHealthcareMonitor } from '../models/HealthcareMonitorModel';

const monitorIdTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Monitor id'],
    minlength: [6, 'Too short Monitor id'],
};

const userTypeOptions: SchemaTypeOptions<ObjectId> = {
    ref: 'user',
};

const patientsTypeOptions: SchemaTypeOptions<Array<ObjectId>> = {
    ref: 'patient',
}

const schemaDefinition: SchemaDefinition<DocumentDefinition<undefined>> = {
    monitorId: monitorIdTypeOptions,
    user: userTypeOptions,
    patients: patientsTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const HealthcareMonitorSchema: Schema<mongoose.Document<IHealthcareMonitor>> = new Schema<mongoose.Document<IHealthcareMonitor>>(schemaDefinition, schemaOptions);

export default HealthcareMonitorSchema;
