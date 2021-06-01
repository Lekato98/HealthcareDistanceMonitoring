import { Injectable } from 'dependency-injection-v1';
import { Request, Response } from 'express';
import { SUCCESS, UNSUCCESSFUL } from '../../helpers/constants';
import { HttpStatusCode } from '../../utils/HttpUtils';
import { IHistory } from '../../models/reports/history/HistoryReportModel';
import HistoryReportService from '../../models/reports/history/HistoryReportService';

@Injectable
class HistoryReportController {
    /**
     * @Route /api/v1/report/history/:historyId
     * @Get
     * */
    public async getReport(req: Request, res: Response): Promise<void> {
        try {
            const historyId = req.params.historyId;
            const report = await HistoryReportService.getReport(historyId);
            const body = {success: SUCCESS, report};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/report/history
     * @Post
     * */
    public async createReport(req: Request, res: Response): Promise<void> {
        try {
            const patient: string = req.app.locals.jwt.roleId;
            const payload: IHistory = {...req.body, patient};
            const report = await HistoryReportService.createReport(payload);
            const body = {success: SUCCESS, report};
            res.status(HttpStatusCode.CREATED_SUCCESSFULLY).json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/report/history/:historyId
     * @Delete
     * */
    public async deleteReport(req: Request, res: Response): Promise<void> {
        try {
            const {historyId} = req.params;
            const userId = req.app.locals.jwt._id;
            const report = await HistoryReportService.deleteReport(historyId, userId);
            const body = {success: SUCCESS, report};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /***
     * @Route /api/v1/report/history/:historyId
     * @Put
     */
    public async updateReport(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.app.locals.jwt._id;
            const historyId: string = req.params.historyId;
            const payload: IHistory = req.body;

            const report = await HistoryReportService.updateReport(historyId, userId, payload);
            const body = {success: SUCCESS, report};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default HistoryReportController;
