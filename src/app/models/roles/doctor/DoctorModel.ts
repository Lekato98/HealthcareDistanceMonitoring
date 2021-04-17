import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getDiscriminatorModelForClass, getModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import UserModel, { RoleName, User } from '../../user/UserModel';
import DoctorModelUtils from './DoctorModelUtils';
import IRole from '../IRole';

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

const activeTypeOptions: BasePropOptions = {
    type: Boolean,
    required: true,
    default: false,
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
class SpecialDoctor implements IRole {
    @Prop(doctorIdTypeOptions) public _id: string;
    @Prop(userIdTypeOptions) public userId: string;
    @Prop(activeTypeOptions) public active: boolean;

    constructor(payload?: IRole) {
        if (payload) {
            this.userId = payload.userId;
            this.active = false;
        }
    }
}

interface IDoctor extends IRole {
    _id: string;
}

const DoctorModel = getModelForClass(SpecialDoctor);

export {
    SpecialDoctor,
    IDoctor,
};
export default DoctorModel;

