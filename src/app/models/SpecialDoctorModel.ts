import { SchemaOptions } from 'mongoose';
import { BasePropOptions, IModelOptions, PropOptionsForString, Ref } from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, mongoose, Prop } from '@typegoose/typegoose';
import { User } from './UserModel';

export interface IDoctor {
    doctorId: string;
    user: Ref<User>;
}

const doctorIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const userTypeOptions: BasePropOptions = {
    type: mongoose.Types.ObjectId,
    ref: 'user',
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'doctor',
    },
};

@ModelOptions(modelOptions)
export class SpecialDoctor {
    @Prop(doctorIdTypeOptions) public doctorId: string;
    @Prop(userTypeOptions) public user: Ref<User>;
}

const DoctorModel = getModelForClass(SpecialDoctor);

export default DoctorModel;

