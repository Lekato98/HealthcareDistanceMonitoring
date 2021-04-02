import mongoose, { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { ISpecialDoctor } from '../models/SpecialDoctorModel';

const doctorIdTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Doctor id'],
    minlength: [6, 'Too short Doctor id'],
};

const userTypeOptions: SchemaTypeOptions<any> = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
};

const schemaDefinition: SchemaDefinition<any> = {
    doctorId: doctorIdTypeOptions,
    user: userTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const SpecialDoctorSchema: Schema<mongoose.Document<ISpecialDoctor>> = new Schema<mongoose.Document<ISpecialDoctor>>(
    schemaDefinition,
    schemaOptions,
);

export default SpecialDoctorSchema;
