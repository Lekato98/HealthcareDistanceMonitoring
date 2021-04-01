import mongoose from 'mongoose';
import DailyQuestionnaireSchema from '../schema/DailyQuestionnaireSchema';
import { IPatient } from './PatientModel';

export interface IDailyQuestionnaire extends mongoose.Document {
    dailyId: string;
    patient: IPatient['_id'];
    headache: number;
    soreThroat: number;
    taste: number;
    smell: number;
    fatigue: number;
    shortnessOfBreath: number;
    positiveContact: boolean;
    exCovid: boolean;
}

abstract class DailyQuestionnaireModel {
    public static readonly MODEL_NAME: string = 'dailyQuestionnaire';
    public static readonly Model: mongoose.Model<IDailyQuestionnaire> = mongoose.model<IDailyQuestionnaire>(
        DailyQuestionnaireModel.MODEL_NAME, DailyQuestionnaireSchema
    );
}

export default DailyQuestionnaireModel;
