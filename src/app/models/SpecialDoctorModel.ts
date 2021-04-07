import { SchemaOptions } from 'mongoose';
import { IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getDiscriminatorModelForClass, ModelOptions, Prop } from '@typegoose/typegoose';
import UserModel, { IUser, RoleName, User } from './UserModel';

const doctorIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: RoleName.DOCTOR,
    },
};

@ModelOptions(modelOptions)
class SpecialDoctor extends User {
    @Prop(doctorIdTypeOptions) public doctorId: string;
}

interface IDoctor extends IUser {
    doctorId: string;
}

const DoctorModel = getDiscriminatorModelForClass(UserModel, SpecialDoctor);

export {
    SpecialDoctor,
    IDoctor,
};
export default DoctorModel;

