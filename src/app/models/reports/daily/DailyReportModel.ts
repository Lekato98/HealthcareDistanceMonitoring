import { SchemaOptions } from 'mongoose';
import {
    BasePropOptions,
    IModelOptions,
    PropOptionsForNumber,
    PropOptionsForString,
    Ref,
} from '@typegoose/typegoose/lib/types';
import { getModelForClass, ModelOptions, Pre, Prop, DocumentType } from '@typegoose/typegoose';
import { Patient } from '../../patient/PatientModel';
import DailyReportUtils from './DailyReportUtils';

const dailyIdTypeOptions: PropOptionsForString = {
    type: String,
    required: true,
    unique: true,
    trim: true,
};

const patientTypeOptions: BasePropOptions = {
    required: true,
    type: () => Patient,
    ref: () => Patient,
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
        customName: 'daily_report',
    },
};

@Pre<DailyReport>('validate', DailyReportUtils.preValidate)
@ModelOptions(modelOptions)
class DailyReport {
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

    public static readonly REPORTS_LIMIT_PER_PAGE = 10;

    public static async findReportByDailyId(dailyId: string, projection: string = ''): Promise<DocumentType<DailyReport>> {
        return DailyReportModel.findOne({dailyId}, projection);
    }

    public static async getAll(pageNumber: number): Promise<DocumentType<DailyReport>[]> {
        const sortStage = {$sort: {createdAt: 1}}; // stage 1 sort by created time
        const skipStage = {$skip: (pageNumber - 1) * this.REPORTS_LIMIT_PER_PAGE}; // stage 2 skip previous pages
        const limitStage = {$limit: DailyReport.REPORTS_LIMIT_PER_PAGE}; // stage 3 limitation users number
        return DailyReportModel.aggregate([
            sortStage,
            skipStage,
            limitStage,
        ]);
    }

    public static async deleteOneReport(dailyId: string): Promise<any> {
        return DailyReportModel.deleteOne({dailyId});
    }

    public static async userReports(userId: string): Promise<DocumentType<DailyReport>[]> {
        return DailyReportModel.find({patient: userId});
    }
}

interface IDailyReport {
    dailyId: string;
    patient: Ref<Patient>;
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
}
export default DailyReportModel;
