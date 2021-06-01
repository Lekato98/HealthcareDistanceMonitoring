import { Router } from 'express';
import IRoute from '../../../IRoute';
import { Inject } from 'dependency-injection-v1';
import HistoryReportController from '../../../../controllers/report/HistoryReportController';
import AuthMiddleware from '../../../../middlewares/AuthMiddleware';

class HistoryReportApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/history';
    public readonly POST_HISTORY_REPORT: string = '/';
    public readonly GET_HISTORY_REPORT: string = '/:historyId';
    public readonly DELETE_HISTORY_REPORT: string = '/:historyId';
    public readonly PUT_HISTORY_REPORT: string = '/:historyId';

    @Inject(HistoryReportController) historyReportController: HistoryReportController;
    @Inject(AuthMiddleware) authMiddleware: AuthMiddleware;


    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public initializeMiddlewares(): void {
        this.ROUTE.use(this.authMiddleware.isAuth);
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.GET_HISTORY_REPORT, this.historyReportController.getReport);
        this.ROUTE.delete(this.DELETE_HISTORY_REPORT, this.historyReportController.deleteReport);
        this.ROUTE.post(this.POST_HISTORY_REPORT, this.historyReportController.createReport);
        this.ROUTE.put(this.PUT_HISTORY_REPORT, this.historyReportController.updateReport);
    }
}

const historyReportApiRoute = new HistoryReportApiRoute();

export {
    historyReportApiRoute as HistoryReportApiRoute,
};
