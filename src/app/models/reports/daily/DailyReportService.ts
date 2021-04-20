import { DocumentType } from '@typegoose/typegoose';
import DailyReportModel, { DailyReport, IDailyReport } from './DailyReportModel';
import UserModel from '../../user/UserModel';

class DailyReportService {
    public static readonly REPORTS_LIMIT_PER_PAGE = 10;

    public static async createReport(reportData: IDailyReport): Promise<DocumentType<DailyReport>> {
        const report = new DailyReport(reportData);
        return DailyReportModel.create(report);
    }

    public static async findReportByDailyId(dailyId: string, projection: string = ''): Promise<DocumentType<DailyReport>> {
        return DailyReportModel.findOne({_id: dailyId}, projection);
    }

    public static async getAll(pageNumber: number): Promise<DocumentType<DailyReport>[]> {
        const sortStage = {$sort: {createdAt: 1}}; // stage 1 sort by created time
        const skipStage = {$skip: (pageNumber - 1) * this.REPORTS_LIMIT_PER_PAGE}; // stage 2 skip previous pages
        const limitStage = {$limit: this.REPORTS_LIMIT_PER_PAGE}; // stage 3 limitation users number
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
        return DailyReportModel.find({userId});
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
