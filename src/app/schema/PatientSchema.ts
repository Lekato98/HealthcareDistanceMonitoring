import { DocumentDefinition, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';

const patientIdTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const userTypeOptions: SchemaTypeOptions<ObjectId> = {
    ref: 'user',
};

const schemaDefinition: SchemaDefinition<DocumentDefinition<undefined>> = {
    patientId: patientIdTypeOptions,
    user: userTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const PatientSchema: Schema = new Schema(schemaDefinition, schemaOptions);

export default PatientSchema;
