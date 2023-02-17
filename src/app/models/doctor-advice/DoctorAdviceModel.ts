import {getModelForClass, ModelOptions, Prop, mongoose} from '@typegoose/typegoose';
import {BasePropOptions, IModelOptions, PropOptionsForString, Ref} from '@typegoose/typegoose/lib/types';
import {User} from "../user/UserModel";
import {nanoid} from "nanoid";

const adviceTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const userTypeOptions: BasePropOptions = {
    type: String,
    required: true,
    ref: () => User,
};

const textTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    minlength: [3, 'Too short advice'],
};

const schemaOptions: mongoose.SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'doctor_advice',
    },
};

@ModelOptions(modelOptions)
export class DoctorAdvice {
    @Prop(adviceTypeOptions) _id: string;
    @Prop(userTypeOptions) userId: Ref<User, string>;
    @Prop(textTypeOptions) text: string;

    constructor(payload: IDoctorAdvice) {
        this._id = payload._id || `advice~${nanoid()}`;
        this.userId = payload.userId;
        this.text = payload.text;
    }
}

export interface IDoctorAdvice {
    _id?: string;
    userId: string;
    text: string;
}

const DoctorAdviceModel = getModelForClass(DoctorAdvice);

export default DoctorAdviceModel;
