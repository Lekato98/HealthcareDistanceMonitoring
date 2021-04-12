import { Router } from 'express';
import IRoute from '../../../IRoute';
import { DailyReportController } from '../../../../controllers/report/DailyReportController';

class DailyReportApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/daily';
    public readonly SUBMIT_REPORT = '/';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.SUBMIT_REPORT, DailyReportController.submitReport)
    }

}

const dailyReportApiRoute = new DailyReportApiRoute();

export {
    dailyReportApiRoute as DailyReportApiRoute
};
