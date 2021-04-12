import { Router } from 'express';
import IRoute from '../../../IRoute';
import { DailyReportController } from '../../../../controllers/report/DailyReportController';

class DailyReportApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/daily';
    public readonly SUBMIT_REPORT = '/';
    public readonly GET_REPORT = '/:dailyId';
    public readonly DELETE_REPORT = '/';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.SUBMIT_REPORT, DailyReportController.submitReport);
        this.ROUTE.get(this.GET_REPORT, DailyReportController.getReport);
        this.ROUTE.delete(this.DELETE_REPORT, DailyReportController.deleteReport);
    }

}

const dailyReportApiRoute = new DailyReportApiRoute();

export {
    dailyReportApiRoute as DailyReportApiRoute,
};
