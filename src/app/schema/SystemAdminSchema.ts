import { DocumentDefinition, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';

const adminIdTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const passwordTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    maxlength: [128, 'Too large Password id'],
    minlength: [6, 'Too short Password id'],
}

const schemaDefinition: SchemaDefinition<DocumentDefinition<undefined>> = {
    adminId: adminIdTypeOptions,
    password: passwordTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const SystemAdminSchema: Schema = new Schema(schemaDefinition, schemaOptions);

export default SystemAdminSchema;
