import { SchemaOptions } from 'mongoose';
import { getModelForClass, ModelOptions, Prop } from '@typegoose/typegoose';
import { IModelOptions, PropOptionsForString } from '@typegoose/typegoose/lib/types';

const adminIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
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
