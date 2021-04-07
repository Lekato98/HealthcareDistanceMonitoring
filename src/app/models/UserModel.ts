import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getModelForClass, index, ModelOptions, pre, Prop } from '@typegoose/typegoose';

const bcrypt = require('bcrypt');

const nationalIdTypeOptions: BasePropOptions = {
    type: String,
    required: true,
    trim: true,
    validate: {
        validator: (value: string) => value.length === 10, // only 10 chars is allowed
        message: 'National id should be 10 characters', // todo validate id
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
    uppercase: true,
    trim: true,
};

const phoneNumberTypeOptions: PropOptionsForString = {
    type: String,
    trim: true,
    maxlength: [15, 'Too large Phone Number'], // todo validate
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
    discriminatorKey: 'role', // used in inheritance as collection name for the childes
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'user',
    },
};

@pre<User>('save', async function (): Promise<void> {
    const payload = this;
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt); // hash password
})
@index({nationalId: 1}, {unique: true})
@ModelOptions(modelOptions)
class User {
    @Prop(nationalIdTypeOptions) public nationalId!: string;
    @Prop(passwordTypeOptions) public password: string;
    @Prop(firstNameTypeOptions) public firstName: string;
    @Prop(lastNameTypeOptions) public lastName: string;
    @Prop(genderTypeOptions) public gender: string;
    @Prop(birthdateTypeOptions) public birthdate: Date;
    @Prop(homeAddressTypeOptions) public homeAddress?: string;
    @Prop(phoneNumberTypeOptions) public phoneNumber?: string;

    public static isValidPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    public static findByNationalId(nationalId: string) {
        return UserModel.findOne({nationalId});
    }
}

interface IUser {
    role: RoleName,
    nationalId: string,
    firstName: string;
    lastName: string;
    gender: string;
    birthdate: Date;
    homeAddress?: string;
    phoneNumber?: string;
    password: string;
}

const enum RoleName {
    PATIENT = 'patient',
    MONITOR = 'healthcare monitor',
    DOCTOR = 'special doctor',
}

const UserModel = getModelForClass(User);

UserModel.createIndexes().catch(err => {
    console.log(err);
    process.exit(0);
});

export {
    User,
    IUser,
    RoleName,
};
export default UserModel;
