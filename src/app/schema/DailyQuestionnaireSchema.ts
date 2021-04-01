import mongoose, { DocumentDefinition, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypeOptions } from 'mongoose';
import { IDailyQuestionnaire } from '../models/DailyQuestionnaireModel';

const dailyIdTypeOptions: SchemaTypeOptions<string> = {
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: [50, 'Too large Daily id'],
    minlength: [6, 'Too short Daily id'],
};

const patientTypeOptions: SchemaTypeOptions<ObjectId> = {
    ref: 'patient',
};

const headacheTypeOptions: SchemaTypeOptions<number> = {
    required: true,
    min: [0, 'Invalid headache rate below'],
    max: [10, 'Invalid headache rate above'],
};

const soreThroatTypeOptions: SchemaTypeOptions<number> = {
    required: true,
    min: [0, 'Invalid headache rate below'],
    max: [10, 'Invalid headache rate above'],
};

const tasteTypeOptions: SchemaTypeOptions<number> = {
    required: true,
    min: [0, 'Invalid headache rate below'],
    max: [10, 'Invalid headache rate above'],
};

const smellTypeOptions: SchemaTypeOptions<number> = {
    required: true,
    min: [0, 'Invalid headache rate below'],
    max: [10, 'Invalid headache rate above'],
};

const fatigueTypeOptions: SchemaTypeOptions<number> = {
    required: true,
    min: [0, 'Invalid headache rate below'],
    max: [10, 'Invalid headache rate above'],
};

const shortnessOfBreathTypeOptions: SchemaTypeOptions<number> = {
    required: true,
    min: [0, 'Invalid headache rate below'],
    max: [10, 'Invalid headache rate above'],
};

const positiveContactTypeOptions: SchemaTypeOptions<boolean> = {
    required: true,
};

const exCovidContactTypeOptions: SchemaTypeOptions<boolean> = {
    required: true,
};

const schemaDefinition: SchemaDefinition<DocumentDefinition<undefined>> = {
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

const DailyQuestionnaireSchema: Schema<mongoose.Document<IDailyQuestionnaire>> = new Schema<mongoose.Document<IDailyQuestionnaire>>(schemaDefinition, schemaOptions);

export default DailyQuestionnaireSchema;
