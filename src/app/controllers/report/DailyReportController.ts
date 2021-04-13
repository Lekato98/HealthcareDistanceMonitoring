import { Request, Response } from 'express';
import DailyReportModel, { IDailyReport } from '../../models/reports/daily/DailyReportModel';
import { HttpStatusCode } from '../../utils/HttpUtils';
import {Injectable} from 'dependency-injection-v1';

@Injectable
class DailyReportController {
    /**
     * @route /api/v1/report/daily
     * @request POST
     * */
    public async submitReport(req: Request, res: Response): Promise<void> {
        try {
            const userId = res.locals.jwt._id;
            const payload: IDailyReport = req.body;
            payload.patient = userId;
            const report = await DailyReportModel.create(payload);
            const body = {success: 1, report};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @route /api/v1/report/daily/:dailyId
     * @request GET
     * */
    public async getReport(req: Request, res: Response): Promise<void> {
        try {
            const {dailyId} = req.params;
            const report = await DailyReportModel.findReportByDailyId(dailyId);

            if (report) {
                const body = {success: 1, report};
                res.json(body);
            } else {
                const body = {success: 0, message: 'Invalid report Daily Id'};
                res.status(HttpStatusCode.NOT_FOUND).json(body);
            }

        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @route /api/v1/report/daily/reports?page=
     * @request GET
     * */
    public async getReportsByPageNumber(req: Request, res: Response): Promise<void> {
        try {
            const page: number = Number(req.query.page) || 1;
            const reports = await DailyReportModel.getAll(page);
            const body = {success: 1, reports};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @route /api/v1/report/daily
     * @request DELETE
     * */
    public async deleteReport(req: Request, res: Response): Promise<void> {
        try {
            const dailyId: string = String(req.query.dailyId) || '';
            const report = await DailyReportModel.deleteOneReport(dailyId);
            const body = {success: 1, report};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @route /api/v1/report/daily/user/:userId
     * @request GET
     * */
    public async getUserReports(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const reports = await DailyReportModel.userReports(userId);
            const body = {success: 1, reports};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default DailyReportController;
