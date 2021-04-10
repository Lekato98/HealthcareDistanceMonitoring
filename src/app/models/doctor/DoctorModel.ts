import { SchemaOptions } from 'mongoose';
import { IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getDiscriminatorModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import UserModel, { IUser, RoleName, User } from '../user/UserModel';
import { nanoid } from 'nanoid';
import DoctorModelUtils from './DoctorModelUtils';

const doctorIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    trim: true,
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

@Pre<SpecialDoctor>('validate', DoctorModelUtils.preValidate)
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

