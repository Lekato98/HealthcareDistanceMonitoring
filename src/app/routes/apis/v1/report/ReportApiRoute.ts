import { Router } from 'express';
import IRoute from '../../../IRoute';
import { DailyReportApiRoute } from './DailyReportApiRoute';
import { HistoryReportApiRoute } from './HistoryReportApiRoute';

class ReportApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/report';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.ROUTE.use(DailyReportApiRoute.ROUTE_PREFIX_URL, DailyReportApiRoute.ROUTE);
        this.ROUTE.use(HistoryReportApiRoute.ROUTE_PREFIX_URL, HistoryReportApiRoute.ROUTE);
    }

}

const reportApiRoute = new ReportApiRoute();

export {
    reportApiRoute as ReportApiRoute,
};

export default reportApiRoute;
