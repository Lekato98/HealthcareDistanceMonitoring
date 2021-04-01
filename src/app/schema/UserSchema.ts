import mongoose, { DocumentDefinition, Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { IUser } from '../models/UserModel';

const firstNameTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    trim: true,
    maxlength: [50, 'Too large First Name'],
    minlength: [1, 'Too short First Name'],
};

const lastNameTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    trim: true,
    maxlength: [50, 'Too large Last Name'],
    minlength: [1, 'Too short Last Name'],
};

const genderTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    lowercase: true,
    trim: true,
    enum: ['male', 'female', 'others'],
};

const birthdateTypeOptions: SchemaTypeOptions<Date> = {
    required: true,
};

const homeAddressTypeOptions: SchemaTypeOptions<string> = {
    lowercase: true,
    trim: true,
};

const phoneNumberTypeOptions: SchemaTypeOptions<string> = {
    trim: true,
    maxlength: [15, 'Too large Phone Number'], // 962123456789
    minlength: [10, 'Too small Phone Number'],
};

const passwordTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    trim: true,
    maxlength: [128, 'Too large Password'],
    minlength: [6, 'Too small Password'],
};

const schemaDefinition: SchemaDefinition<DocumentDefinition<undefined>> = {
    firstName: firstNameTypeOptions,
    lastName: lastNameTypeOptions,
    gender: genderTypeOptions,
    birthdate: birthdateTypeOptions,
    homeAddress: homeAddressTypeOptions,
    phoneNumber: phoneNumberTypeOptions,
    password: passwordTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const UserSchema: Schema<mongoose.Document<IUser>> = new Schema<mongoose.Document<IUser>>(schemaDefinition, schemaOptions);

export default UserSchema;
