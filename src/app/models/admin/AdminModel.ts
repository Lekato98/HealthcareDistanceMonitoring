import { SchemaOptions } from 'mongoose';
import { getModelForClass, ModelOptions, Prop } from '@typegoose/typegoose';
import { IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';

const adminIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Patient id'],
    minlength: [6, 'Too short Patient id'],
};

const passwordTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    maxlength: [128, 'Too large Password id'],
    minlength: [6, 'Too short Password id'],
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'admin',
    },
};

@ModelOptions(modelOptions)
export class SystemAdmin {
    @Prop(adminIdTypeOptions) public adminId: string;
    @Prop(passwordTypeOptions) public password: string;
}

const AdminModel = getModelForClass(SystemAdmin);

export default AdminModel;
