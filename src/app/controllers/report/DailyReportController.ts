import { Request, Response } from 'express';
import { IDailyReport } from '../../models/reports/daily/DailyReportModel';
import { HttpStatusCode } from '../../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';
import DailyReportService from '../../models/reports/daily/DailyReportService';
import PatientService from '../../models/roles/patient/PatientService';

@Injectable
class DailyReportController {
    /**
     * @route /api/v1/report/daily
     * @request POST
     * */
    public async submitReport(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.app.locals.jwt._id;
            const payload: IDailyReport = {...req.body, userId};
            const report = await DailyReportService.createReport(payload);
            const patchReport = await PatientService.patchNextReportDate(userId);
            const body = {success: 1, report, patchReport};
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
            const report = await DailyReportService.findReportByDailyId(dailyId);

            if (report) {
                const body = {success: 1, report};
                res.json(body);
            } else {
                const body = {success: 0, message: 'Report not found'};
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
            const reports = await DailyReportService.getAll(page);
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
            const report = await DailyReportService.deleteOneReport(dailyId);
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
            const {userId} = req.params;
            const reports = await DailyReportService.getReportsByUserId(userId);
            const body = {success: 1, reports};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @route /api/v1/report/daily/user/national/:nationalId
     * @request GET
     * */
    public async getUserReportsNationalId(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = req.params;
            const reports = await DailyReportService.getReportsByNationalId(nationalId);
            const body = {success: 1, reports};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default DailyReportController;
