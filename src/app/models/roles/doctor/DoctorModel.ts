import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import { RoleName, User } from '../../user/UserModel';
import DoctorModelUtils from './DoctorModelUtils';
import IRole, { Status } from '../IRole';

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

const statusTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: [Status.ACCEPTED, Status.PENDING, Status.REJECTED],
    default: Status.PENDING,
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

@Pre<Doctor>('validate', DoctorModelUtils.preValidate)
@ModelOptions(modelOptions)
class Doctor implements IRole {
    @Prop(doctorIdTypeOptions) public _id: string;
    @Prop(userIdTypeOptions) public userId: string;
    @Prop(activeTypeOptions) public active: boolean;
    @Prop(statusTypeOptions) public status: string;

    constructor(payload?: IRole) {
        if (payload) {
            this.userId = payload.userId;
        }
    }
}

interface IDoctor extends IRole {
    _id: string;
}

const DoctorModel = getModelForClass(Doctor);

export {
    Doctor,
    IDoctor,
};
export default DoctorModel;

