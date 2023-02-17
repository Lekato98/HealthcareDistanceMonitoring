import {DocumentType, mongoose} from '@typegoose/typegoose';
import DailyReportModel, { DailyReport, IDailyReport } from './DailyReportModel';
import UserModel from '../../user/UserModel';
import PatientService from "../../roles/patient/PatientService";

class DailyReportService {
    public static readonly REPORTS_LIMIT_PER_PAGE = 10;

    public static async createReport(reportData: IDailyReport): Promise<DocumentType<DailyReport>> {
        const report = new DailyReport(reportData);
        await PatientService.updateStatus(String(reportData.patientId));
        return DailyReportModel.create(report);
    }

    public static async findReportByDailyId(dailyId: string, projection: string = ''): Promise<DocumentType<DailyReport>> {
        return DailyReportModel.findOne({_id: dailyId}, projection);
    }

    public static async getAll(pageNumber: number): Promise<DocumentType<DailyReport>[]> {
        const sortStage: mongoose.PipelineStage = {$sort: {firstName: 1, lastName: 1}}; // stage 1 sort by created time
        const skipStage: mongoose.PipelineStage = {$skip: (pageNumber - 1) * this.REPORTS_LIMIT_PER_PAGE}; // stage 2 skip previous pages
        const limitStage: mongoose.PipelineStage = {$limit: this.REPORTS_LIMIT_PER_PAGE}; // stage 3 limitation users number
        return DailyReportModel.aggregate([
            sortStage,
            skipStage,
            limitStage,
        ]);
    }

    public static async deleteOneReport(dailyId: string): Promise<any> {
        return DailyReportModel.findOneAndDelete({dailyId});
    }

    public static async getReportsByUserId(userId: string): Promise<DocumentType<DailyReport>[]> {
        const matchStage = {$match: {userId}};
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
            },
        };
        const unwindStage = {$unwind: '$user'};
        const projectionStage = {$project: {'user.password': 0}};
        const pipeline = [matchStage, lookupStage, unwindStage, projectionStage];
        return DailyReportModel.aggregate(pipeline);
    }

    public static async getReportsByPatientId(patientId: string): Promise<any> {
        return DailyReportModel.find({patient: patientId});
    }

    public static async getReportsByNationalId(nationalId: string): Promise<DocumentType<DailyReport>[]> {
        // faster than population by twice
        // aggregate avg 6ms
        // populate avg 12ms
        const matchStage = {$match: {nationalId}}; // get user with the given national id

        // join then filter by _id
        const lookupStage = {
            $lookup: {
                from: DailyReportModel.collection.name,
                localField: '_id',
                foreignField: 'userId',
                as: 'reports',
            },
        };

        const projectionStage = {
            $project: {
                _id: 0,
                reports: 1,
            },
        };

        const unwindStage = {$unwind: '$reports'};

        const pipeline = [matchStage, lookupStage, projectionStage, unwindStage];

        return UserModel.aggregate(pipeline);
    }
}

export default DailyReportService;
