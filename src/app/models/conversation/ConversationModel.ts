import {getModelForClass, ModelOptions, mongoose, Prop, PropType, Severity} from '@typegoose/typegoose';
import {
    ArrayPropOptions,
    BasePropOptions,
    IModelOptions,
    PropOptionsForString,
    Ref
} from '@typegoose/typegoose/lib/types';
import {User} from "../user/UserModel";
import {nanoid} from "nanoid";

const messageIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const userTypeOptions: ArrayPropOptions = {
    type: [String],
    required: true,
    ref: () => User,
};

const textTypeOptions: BasePropOptions = {
    type: [mongoose.Schema.Types.Mixed],
    required: true,
};

const uniqueKeyTypeOptions: PropOptionsForString = {
    type: String,
    unique: true,
    required: true,
};

const schemaOptions: mongoose.SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'conversation',
        allowMixed: Severity.ALLOW,
    },
};

@ModelOptions(modelOptions)
export class Conversation {
    @Prop(messageIdTypeOptions) _id: string;
    @Prop(uniqueKeyTypeOptions) uniqueKey: string;
    @Prop(userTypeOptions, PropType.ARRAY) users: string[];
    @Prop(textTypeOptions) messages: string[];

    constructor(payload: IConversation) {
        this._id = payload._id || `conversation~${nanoid()}`;
        this.users = payload.users;
        this.messages = payload.messages || [];
        if (this.users.length < 2) {
            throw new Error("Invalid Conversation");
        }

        this.uniqueKey = this.users.sort().join('~');
    }
}

export interface IConversation {
    _id?: string;
    users: string[];
    messages?: string[];
}

const ConversationModel = getModelForClass(Conversation);

export default ConversationModel;
