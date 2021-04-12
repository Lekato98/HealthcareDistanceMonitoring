import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { DocumentType, getModelForClass, Index, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import UserModelUtils from './UserModelUtils';
import PhoneUtils from '../../utils/PhoneUtils';

const bcrypt = require('bcrypt');

const enum RoleName {
    PATIENT = 'patient',
    MONITOR = 'monitor',
    DOCTOR = 'doctor',
}

const enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

const nationalIdTypeOptions: PropOptionsForString = {
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
    enum: [Gender.MALE, Gender.FEMALE, Gender.OTHER],
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
    validate: {
        validator: PhoneUtils.validatePhoneNumber,
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

const roleTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    enum: [RoleName.PATIENT, RoleName.DOCTOR, RoleName.MONITOR],
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

@Pre<User>('save', UserModelUtils.preSave)
@Index({nationalId: 1}, {unique: true})
@ModelOptions(modelOptions)
class User {
    @Prop(roleTypeOptions) public role!: string;
    @Prop(nationalIdTypeOptions) public nationalId!: string;
    @Prop(passwordTypeOptions) public password!: string;
    @Prop(firstNameTypeOptions) public firstName!: string;
    @Prop(lastNameTypeOptions) public lastName!: string;
    @Prop(genderTypeOptions) public gender!: string;
    @Prop(birthdateTypeOptions) public birthdate!: Date;
    @Prop(homeAddressTypeOptions) public homeAddress?: string;
    @Prop(phoneNumberTypeOptions) public phoneNumber?: string;

    constructor() {
        // null object
        this.password = '';
        this.firstName = '';
        this.lastName = '';
        this.gender = '';
        this.birthdate = new Date();
        this.homeAddress = '';
        this.phoneNumber = '';
    }

    public static readonly USERS_LIMIT_PER_PAGE: number = 20; // used for get all users

    public static isValidPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    public static async findByNationalId(nationalId: string, projection: string = ''): Promise<DocumentType<User>> {
        return UserModel.findOne({nationalId}, projection);
    }

    public static async patchOne(nationalId: string, payload: object): Promise<any> {
        const userObject = UserModelUtils.createUserObjectFromObject(payload);
        return UserModel.updateOne({nationalId}, {...userObject});
    }

    public static async getAll(pageNumber: number): Promise<DocumentType<User>[]> {
        const sortStage = {$sort: {createdAt: 1}}; // stage 1 sort by created time
        const skipStage = {$skip: (pageNumber - 1) * this.USERS_LIMIT_PER_PAGE}; // stage 2 skip previous pages
        const limitStage = {$limit: User.USERS_LIMIT_PER_PAGE}; // stage 3 limitation users number
        const projectionStage = {$project: {password: 0, updatedAt: 0}}; // stage 4 remove password from the data

        return UserModel.aggregate([
            sortStage,
            skipStage,
            limitStage,
            projectionStage,
        ]);
    }

    public static async deleteOneUser(nationalId: string) {
        return UserModel.deleteOne({nationalId});
    }
}

interface IUser {
    role: RoleName;
    nationalId: string;
    firstName: string;
    lastName: string;
    gender: Gender;
    birthdate: Date;
    homeAddress?: string;
    phoneNumber?: string;
    password: string;
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
    Gender,
};
export default UserModel;
