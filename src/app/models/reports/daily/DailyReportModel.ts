import { SchemaOptions } from 'mongoose';
import {
    BasePropOptions,
    IModelOptions,
    PropOptionsForNumber,
    PropOptionsForString,
    Ref,
} from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, Pre, Prop } from '@typegoose/typegoose';
import { Patient } from '../../roles/patient/PatientModel';
import DailyReportModelHooks from './DailyReportModelHooks';

const dailyIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    trim: true,
};

const patientTypeOptions: BasePropOptions = {
    required: true,
    type: () => String,
    ref: () => Patient,
};

const headacheTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Headache rate below'],
    max: [5, 'Invalid Headache rate above'],
};

const soreThroatTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Sore Throat rate below'],
    max: [5, 'Invalid Sore Throat rate above'],
};

const tasteTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Taste rate below'],
    max: [5, 'Invalid Taste rate above'],
};

const smellTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Smell rate below'],
    max: [5, 'Invalid Smell rate above'],
};

const fatigueTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Fatigue rate should be in range [0, 5]'],
    max: [5, 'Invalid Fatigue rate should be in range [0, 5]'],
};

const shortnessOfBreathTypeOptions: PropOptionsForNumber = {
    type: Number,
    required: true,
    min: [0, 'Invalid Shortness rate below'],
    max: [5, 'Invalid Shortness rate above'],
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
        customName: 'daily_report',
    },
};

@Pre<DailyReport>('validate', DailyReportModelHooks.preValidate)
@ModelOptions(modelOptions)
class DailyReport {
    @Prop(dailyIdTypeOptions) _id: string;
    @Prop(patientTypeOptions) userId: Ref<Patient, string>;
    @Prop(headacheTypeOptions) headache: number;
    @Prop(soreThroatTypeOptions) soreThroat: number;
    @Prop(tasteTypeOptions) taste: number;
    @Prop(smellTypeOptions) smell: number;
    @Prop(fatigueTypeOptions) fatigue: number;
    @Prop(shortnessOfBreathTypeOptions) shortnessOfBreath: number;
    @Prop(positiveContactTypeOptions) positiveContact: boolean;
    @Prop(exCovidContactTypeOptions) exCovid: boolean;

    constructor(report?: DailyReport) {
        this.userId = report?.userId || null;
        this.headache = report?.headache || 0;
        this.soreThroat = report?.soreThroat || 0;
        this.taste = report?.taste || 0;
        this.smell = report?.smell || 0;
        this.fatigue = report?.fatigue || 0;
        this.shortnessOfBreath = report?.shortnessOfBreath || 0;
        this.positiveContact = report?.positiveContact || false;
        this.exCovid = report?.exCovid || false;
    }
}

interface IDailyReport {
    _id: string;
    userId: Ref<Patient, string>;
    headache: number;
    soreThroat: number;
    taste: number;
    smell: number;
    fatigue: number;
    shortnessOfBreath: number;
    positiveContact: boolean;
    exCovid: boolean;
}

const DailyReportModel = getModelForClass(DailyReport);

export {
    DailyReport,
    IDailyReport,
};
export default DailyReportModel;
