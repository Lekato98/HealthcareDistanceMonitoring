import { DocumentType } from '@typegoose/typegoose';
import HistoryReportModel, { HistoryReport, IHistory } from './HistoryReportModel';
import UserModel from '../../user/UserModel';
import PatientService from '../../roles/patient/PatientService';
import { QueryUpdateOptions } from 'mongoose';

class HistoryReportService {
    public static readonly REPORTS_LIMIT_PER_PAGE = 10;

    public static async getReport(reportId: string): Promise<DocumentType<HistoryReport>> {
        return HistoryReportModel.findById(reportId);
    }

    public static async getReportByUserId(userId: string): Promise<DocumentType<HistoryReport>> {
        return HistoryReportModel.findOne({userId});
    }

    public static async getReportByNationalId(nationalId: string): Promise<DocumentType<any>> {
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        };
        const unwindStage = {$unwind: 'user'};
        const matchStage = {$match: {nationalId}};
        const pipeline = [lookupStage, unwindStage, matchStage];

        return HistoryReportModel.aggregate(pipeline);
    }

    public static async createReport(payload: IHistory): Promise<DocumentType<HistoryReport>> {
        const historyReport = new HistoryReport(payload);
        return HistoryReportModel.create(historyReport);
    }

    public static async deleteReport(historyId: string, userId: string): Promise<DocumentType<HistoryReport>> {
        const patient = await PatientService.getPatientByUserId(userId);
        return HistoryReportModel.findOneAndDelete({_id: historyId, patient: patient._id});
    }

    public static async updateReport(historyId: string, userId: string, payload: IHistory) {
        const patient = await PatientService.getPatientByUserId(userId);
        const report = new HistoryReport(payload);
        const options: QueryUpdateOptions = {runValidators: true};

        return HistoryReportModel.updateOne({_id: historyId, patient: patient._id}, report, options);
    }
}

export default HistoryReportService;
