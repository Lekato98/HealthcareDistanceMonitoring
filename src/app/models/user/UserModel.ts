import {SchemaOptions} from 'mongoose';
import {ArrayPropOptions, BasePropOptions, IModelOptions, PropOptionsForString} from '@typegoose/typegoose/lib/types';
import {arrayProp, getModelForClass, Index, ModelOptions, Prop, Severity, mongoose} from '@typegoose/typegoose';
import UserValidator from './UserValidator';
import {UNIQUE} from '../../helpers/constants';
import PhoneUtils from '../../utils/PhoneUtils';

export enum RoleName {
    PATIENT = 'patient',
    MENTOR = 'mentor',
    DOCTOR = 'doctor',
    NO_ROLE = 'no-role',
}

export const enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

const userIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    immutable: true,
};

const nationalIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    validate: {
        validator: UserValidator.nationalIdValidator,
        message: 'Invalid national id',
    },
};

const firstNameTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'Too large First Name'],
    minlength: [3, 'Too short First Name'],
};

const lastNameTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'Too large Last Name'],
    minlength: [3, 'Too short Last Name'],
};

const emailTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
};

const genderTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    enum: [Gender.MALE, Gender.FEMALE],
};

const avatarTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
};

const birthdateTypeOptions: BasePropOptions = {
    type: Date,
    required: true,
};

const homeAddressTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const phoneNumberTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    validate: {
        validator: PhoneUtils.isValidJordanNumber,
        message: 'Invalid phone number',
    },
};

const passwordTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    maxlength: [128, 'Too large Password'],
    minlength: [6, 'Too short Password'],
};

const notificationsTypeOptions: ArrayPropOptions = {
    type: [mongoose.Schema.Types.Mixed],
    default: [],
};

const securityTypeOptions: BasePropOptions = {
    type: mongoose.Schema.Types.Mixed,
    required: true
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
    discriminatorKey: '', // used in inheritance as collection name for the childes
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'user',
        allowMixed: Severity.ALLOW,
    },
};

@Index({nationalId: 1}, {unique: UNIQUE})
@ModelOptions(modelOptions)
export class User {
    @Prop(userIdTypeOptions) public _id!: string;
    @Prop(nationalIdTypeOptions) public nationalId!: string;
    @Prop(emailTypeOptions) public email!: string;
    @Prop(passwordTypeOptions) public password!: string;
    @Prop(firstNameTypeOptions) public firstName!: string;
    @Prop(lastNameTypeOptions) public lastName!: string;
    @Prop(genderTypeOptions) public gender!: string;
    @Prop(avatarTypeOptions) public avatar!: string;
    @Prop(birthdateTypeOptions) public birthdate!: Date;
    @Prop(homeAddressTypeOptions) public homeAddress!: string;
    @Prop(phoneNumberTypeOptions) public phoneNumber!: string;
    @Prop(securityTypeOptions) public security!: ISecurity;
    @arrayProp(notificationsTypeOptions) public notifications?: object[];

    constructor(user?: IUser) {
        this.nationalId = user?.nationalId || '';
        this.email = user?.email || '';
        this.password = user?.password || '';
        this.firstName = user?.firstName || '';
        this.lastName = user?.lastName || '';
        this.gender = user?.gender || '';
        this.birthdate = user?.birthdate || new Date();
        this.homeAddress = user?.homeAddress || '';
        this.phoneNumber = user?.phoneNumber || '';
        this.avatar = user?.avatar || '';
        this.security = user?.security;
    }
}

export interface ISecurity {
    question: string,
    answer: string;
}

export interface IUser {
    _id?: string;
    nationalId: string;
    email: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    avatar: string;
    birthdate: Date;
    homeAddress: string;
    phoneNumber: string;
    password: string;
    security: ISecurity;
}

const UserModel = getModelForClass(User);

UserModel.createIndexes().catch((err) => {
    console.error(err);
    process.exit(0);
});

export type roleType = RoleName | undefined;

export default UserModel;
