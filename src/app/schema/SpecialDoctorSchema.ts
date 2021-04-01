import mongoose, { DocumentDefinition, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { ISpecialDoctor } from '../models/SpecialDoctorModel';

const doctorIdTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Doctor id'],
    minlength: [6, 'Too short Doctor id'],
};

const userTypeOptions: SchemaTypeOptions<ObjectId> = {
    ref: 'user',
};

const schemaDefinition: SchemaDefinition<DocumentDefinition<undefined>> = {
    doctorId: doctorIdTypeOptions,
    user: userTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const SpecialDoctorSchema: Schema<mongoose.Document<ISpecialDoctor>> = new Schema<mongoose.Document<ISpecialDoctor>>(schemaDefinition, schemaOptions);

export default SpecialDoctorSchema;
