import { SchemaOptions } from 'mongoose';
import {
    BasePropOptions,
    IModelOptions,
    PropOptionsForNumber,
    PropOptionsForString,
    Ref,
} from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, Prop } from '@typegoose/typegoose';
import { Patient } from './PatientModel';

const dailyIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Daily id'],
    minlength: [6, 'Too short Daily id'],
};

const patientTypeOptions: BasePropOptions = {
    type: Number,
    ref: 'patient',
};

const headacheTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Headache rate below'],
    max: [10, 'Invalid Headache rate above'],
};

const soreThroatTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Sore Throat rate below'],
    max: [10, 'Invalid Sore Throat rate above'],
};

const tasteTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Taste rate below'],
    max: [10, 'Invalid Taste rate above'],
};

const smellTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Smell rate below'],
    max: [10, 'Invalid Smell rate above'],
};

const fatigueTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Fatigue rate below'],
    max: [10, 'Invalid Fatigue rate above'],
};

const shortnessOfBreathTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Shortness rate below'],
    max: [10, 'Invalid Shortness rate above'],
};

const positiveContactTypeOptions: BasePropOptions = {
    type: Boolean,
    required: true,
};

const exCovidContactTypeOptions: BasePropOptions = {
    type: Boolean,
    required: true,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const modelOptions: IModelOptions = {
    schemaOptions,
    options: {
        customName: 'daily_questionnaire',
    },
};

@ModelOptions(modelOptions)
class DailyQuestionnaire {
    @Prop(dailyIdTypeOptions) dailyId: string;
    @Prop(patientTypeOptions) patient: Ref<Patient>;
    @Prop(headacheTypeOptions) headache: number;
    @Prop(soreThroatTypeOptions) soreThroat: number;
    @Prop(tasteTypeOptions) taste: number;
    @Prop(smellTypeOptions) smell: number;
    @Prop(fatigueTypeOptions) fatigue: number;
    @Prop(shortnessOfBreathTypeOptions) shortnessOfBreath: number;
    @Prop(positiveContactTypeOptions) positiveContact: boolean;
    @Prop(exCovidContactTypeOptions) exCovid: boolean;
}

const DailyQuestionnaireModel = getModelForClass(DailyQuestionnaire);

export default DailyQuestionnaireModel;
