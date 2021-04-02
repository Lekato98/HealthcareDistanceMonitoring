import mongoose, { Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { IDailyQuestionnaire } from '../models/DailyQuestionnaireModel';

const dailyIdTypeOptions: SchemaTypeOptions<any> = {
    type: 'String',
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Daily id'],
    minlength: [6, 'Too short Daily id'],
};

const patientTypeOptions: SchemaTypeOptions<any> = {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient',
};

const headacheTypeOptions: SchemaTypeOptions<any> = {
    type: 'Number',
    required: true,
    min: [0, 'Invalid Headache rate below'],
    max: [10, 'Invalid Headache rate above'],
};

const soreThroatTypeOptions: SchemaTypeOptions<any> = {
    type: 'Number',
    required: true,
    min: [0, 'Invalid Sore Throat rate below'],
    max: [10, 'Invalid Sore Throat rate above'],
};

const tasteTypeOptions: SchemaTypeOptions<any> = {
    type: 'Number',
    required: true,
    min: [0, 'Invalid Taste rate below'],
    max: [10, 'Invalid Taste rate above'],
};

const smellTypeOptions: SchemaTypeOptions<any> = {
    type: 'Number',
    required: true,
    min: [0, 'Invalid Smell rate below'],
    max: [10, 'Invalid Smell rate above'],
};

const fatigueTypeOptions: SchemaTypeOptions<any> = {
    type: 'Number',
    required: true,
    min: [0, 'Invalid Fatigue rate below'],
    max: [10, 'Invalid Fatigue rate above'],
};

const shortnessOfBreathTypeOptions: SchemaTypeOptions<any> = {
    type: 'Number',
    required: true,
    min: [0, 'Invalid Shortness rate below'],
    max: [10, 'Invalid Shortness rate above'],
};

const positiveContactTypeOptions: SchemaTypeOptions<any> = {
    type: 'Boolean',
    required: true,
};

const exCovidContactTypeOptions: SchemaTypeOptions<any> = {
    type: 'Boolean',
    required: true,
};

const schemaDefinition: SchemaDefinition<any> = {
    dailyId: dailyIdTypeOptions,
    patient: patientTypeOptions,
    headache: headacheTypeOptions,
    soreThroat: soreThroatTypeOptions,
    taste: tasteTypeOptions,
    smell: smellTypeOptions,
    fatigue: fatigueTypeOptions,
    shortnessOfBreath: shortnessOfBreathTypeOptions,
    positiveContact: positiveContactTypeOptions,
    exCovid: exCovidContactTypeOptions,
};

const schemaOptions: SchemaOptions = {
    timestamps: true,
};

const DailyQuestionnaireSchema: Schema<mongoose.Document<IDailyQuestionnaire>> = new Schema<mongoose.Document<IDailyQuestionnaire>>(
    schemaDefinition,
    schemaOptions,
);

export default DailyQuestionnaireSchema;
