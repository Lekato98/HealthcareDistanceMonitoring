import mongoose from 'mongoose';
import HealthcareMonitorSchema from '../schema/HealthcareMonitorSchema';
import { IPatient } from './PatientModel';

export interface IHistoryReport extends mongoose.Document {
    historyId: string;
    patient: IPatient['_id'];
    text: string;
}

abstract class HistoryReportModel {
    public static readonly MODEL_NAME: string = 'historyReport';
    public static readonly Model: mongoose.Model<IHistoryReport> = mongoose.model<IHistoryReport>(
        HistoryReportModel.MODEL_NAME, HealthcareMonitorSchema
    );
}

export default HistoryReportModel;
