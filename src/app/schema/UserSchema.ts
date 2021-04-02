import mongoose, { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { IUser } from '../models/UserModel';

const bcrypt = require('bcrypt');

const firstNameTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    trim: true,
    maxlength: [50, 'Too large First Name'],
    minlength: [1, 'Too short First Name'],
};

const lastNameTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    trim: true,
    maxlength: [50, 'Too large Last Name'],
    minlength: [1, 'Too short Last Name'],
};

const genderTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    lowercase: true,
    trim: true,
    enum: ['male', 'female', 'other'],
};

const birthdateTypeOptions: SchemaTypeOptions<any> = {
    type: mongoose.Schema.Types.Date,
    required: true,
};

const homeAddressTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    lowercase: true,
    trim: true,
};

const phoneNumberTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    trim: true,
    maxlength: [15, 'Too large Phone Number'], // 962123456789
    minlength: [10, 'Too small Phone Number'],
};

const passwordTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    trim: true,
    maxlength: [128, 'Too large Password'],
    minlength: [6, 'Too small Password'],
};

const schemaDefinition: SchemaDefinition<any> = {
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

const UserSchema: Schema<mongoose.Document<IUser>> = new Schema<mongoose.Document<IUser>>(
    schemaDefinition,
    schemaOptions,
);

UserSchema.pre<IUser>('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

export default UserSchema;
