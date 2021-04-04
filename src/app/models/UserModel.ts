import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, pre, Prop } from '@typegoose/typegoose';

const bcrypt = require('bcrypt');

const nationalIdTypeOptions: BasePropOptions = {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
        validator: (value: string) => value.length === 10, // only 10 chars is allowed
        message: 'National id should be 10 characters',
    },
};

const firstNameTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Too large First Name'],
    minlength: [1, 'Too short First Name'],
};

const lastNameTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Too large Last Name'],
    minlength: [1, 'Too short Last Name'],
};

const genderTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    enum: ['male', 'female', 'other'],
};

const birthdateTypeOptions: BasePropOptions = {
    type: Date,
    required: true,
};

const homeAddressTypeOptions: PropOptionsForString = {
    type: String,
    lowercase: true,
    trim: true,
};

const phoneNumberTypeOptions: PropOptionsForString = {
    type: String,
    trim: true,
    maxlength: [15, 'Too large Phone Number'], // 962123456789
    minlength: [10, 'Too short Phone Number'],
};

const passwordTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    maxlength: [128, 'Too large Password'],
    minlength: [6, 'Too short Password'],
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'user'
    }
};

export interface IUser {
    nationalId: string,
    firstName: string;
    lastName: string;
    gender: string;
    birthdate: Date;
    homeAddress?: string;
    phoneNumber?: string;
    password: string;
}

@pre<User>('save', async function () {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // hash password
})
@ModelOptions(modelOptions)
export class User {
    @Prop(nationalIdTypeOptions) public nationalId!: string;
    @Prop(firstNameTypeOptions) public firstName: string;
    @Prop(lastNameTypeOptions) public lastName: string;
    @Prop(genderTypeOptions) public gender: string;
    @Prop(birthdateTypeOptions) public birthdate: string;
    @Prop(homeAddressTypeOptions) public homeAddress?: Date;
    @Prop(phoneNumberTypeOptions) public phoneNumber?: string;
    @Prop(passwordTypeOptions) public password: string;
}

const UserModel = getModelForClass(User);

export default UserModel;
