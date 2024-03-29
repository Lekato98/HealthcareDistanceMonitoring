import {getModelForClass, ModelOptions, Pre, Prop, mongoose} from '@typegoose/typegoose';
import {
    ArrayPropOptions,
    BasePropOptions,
    IModelOptions,
    PropOptionsForString,
    Ref,
} from '@typegoose/typegoose/lib/types';
import {RoleName, User} from '../../user/UserModel';
import {Patient} from '../patient/PatientModel';
import MentorModelUtils from './MentorModelUtils';
import IRole, {Status} from '../IRole';

const mentorIdTypeOptions: PropOptionsForString = {
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

const patientsTypeOptions: ArrayPropOptions = {
    type: () => [String],
    ref: () => Patient,
    default: [],
    required: true,
};

const statusTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: [Status.ACCEPTED, Status.PENDING, Status.REJECTED],
    default: Status.PENDING,
};

const adviceTypeOptions: PropOptionsForString = {
    type: String,
    trim: true,
    minlength: [3, 'Too short advice'],
    maxlength: [200, 'Too long advice'],
};

const schemaOptions: mongoose.SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: RoleName.MENTOR,
    },
};

@Pre<Mentor>('validate', MentorModelUtils.preValidate)
@ModelOptions(modelOptions)
class Mentor implements IRole {
    @Prop(mentorIdTypeOptions) _id: string;
    @Prop(patientsTypeOptions) patients: Ref<Patient>[];
    @Prop(userIdTypeOptions) public userId: string;
    @Prop(activeTypeOptions) public active: boolean;
    @Prop(statusTypeOptions) public status: string;
    @Prop(adviceTypeOptions) public advice?: string;

    constructor(payload?: IRole) {
        if (payload) {
            this._id = payload._id;
            this.userId = payload.userId;
        }
    }
}

interface IMentor extends IRole {
    _id: string;
    patients?: string[];
    advice?: string;
}

const MentorModel = getModelForClass(Mentor);

export {
    Mentor,
    IMentor,
};
export default MentorModel;
