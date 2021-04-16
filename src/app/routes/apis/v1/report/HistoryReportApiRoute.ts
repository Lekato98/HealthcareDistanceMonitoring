import { Router } from 'express';
import IRoute from '../../../IRoute';

class HistoryReportApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/history';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
    }

}

const historyReportApiRoute = new HistoryReportApiRoute();

export {
    historyReportApiRoute as HistoryReportApiRoute,
};
