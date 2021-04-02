import mongoose, { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { IPatient } from '../models/PatientModel';

const patientIdTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const userTypeOptions: SchemaTypeOptions<any> = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
};

const schemaDefinition: SchemaDefinition<any> = {
    patientId: patientIdTypeOptions,
    user: userTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const PatientSchema: Schema<mongoose.Document<IPatient>> = new Schema<mongoose.Document<IPatient>>(schemaDefinition, schemaOptions);

export default PatientSchema;
