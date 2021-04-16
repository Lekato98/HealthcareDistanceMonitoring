import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getDiscriminatorModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import UserModel, { RoleName, User } from '../user/UserModel';
import DoctorModelUtils from './DoctorModelUtils';

const doctorIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const userIdTypeOptions: BasePropOptions = {
    type: () => String,
    ref: () => User,
    required: true,
    unique: true,
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
class SpecialDoctor {
    @Prop(doctorIdTypeOptions) public _id: string;
    @Prop(userIdTypeOptions) public userId: string;
}

interface IDoctor {
    _id: string;
    userId?: string;
}

const DoctorModel = getDiscriminatorModelForClass(UserModel, SpecialDoctor);

export {
    SpecialDoctor,
    IDoctor,
};
export default DoctorModel;

