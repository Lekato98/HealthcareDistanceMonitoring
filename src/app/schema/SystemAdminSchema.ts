import mongoose, { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { ISystemAdmin } from '../models/SystemAdminModel';

const adminIdTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const passwordTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    maxlength: [128, 'Too large Password id'],
    minlength: [6, 'Too short Password id'],
};

const schemaDefinition: SchemaDefinition<any> = {
    adminId: adminIdTypeOptions,
    password: passwordTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const SystemAdminSchema: Schema<mongoose.Document<ISystemAdmin>> = new Schema<mongoose.Document<ISystemAdmin>>(
    schemaDefinition,
    schemaOptions,
);

export default SystemAdminSchema;
