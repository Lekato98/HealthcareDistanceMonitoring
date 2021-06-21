import { Router } from 'express';
import IRoute from '../../../IRoute';
import DailyReportController from '../../../../controllers/report/DailyReportController';
import AuthMiddleware from '../../../../middlewares/AuthMiddleware';
import { Inject } from 'dependency-injection-v1';
import DailyReportMiddleware from '../../../../middlewares/DailyReportMiddleware';
import PatientMiddleware from '../../../../middlewares/PatientMiddleware';

class DailyReportApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/daily';
    public readonly SUBMIT_REPORT = '/';
    public readonly GET_REPORT = '/:dailyId';
    public readonly DELETE_REPORT = '/';
    public readonly GET_USER_REPORTS = '/user/:userId';
    public readonly GET_REPORTS = '/reports';
    public readonly GET_USER_REPORTS_BY_NATIONAL_ID = '/user/national/:nationalId';
    @Inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware;
    @Inject(DailyReportMiddleware) private readonly dailyReportMiddleware: DailyReportMiddleware;
    @Inject(DailyReportController) private readonly dailyReportController: DailyReportController;
    @Inject(PatientMiddleware) private readonly patientMiddleware: PatientMiddleware;

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public initializeMiddlewares() {
        this.ROUTE.use(this.authMiddleware.isAuth);
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.GET_USER_REPORTS_BY_NATIONAL_ID, this.dailyReportController.getUserReportsNationalId);
        // leave in top for route priority
        this.ROUTE.get(this.GET_USER_REPORTS, this.dailyReportController.getUserReports);
        this.ROUTE.post(
            this.SUBMIT_REPORT,
            [this.patientMiddleware.isPatient, this.dailyReportMiddleware.isDailyReportAvailable],
            this.dailyReportController.submitReport,
        );
        this.ROUTE.get(this.GET_REPORTS, this.dailyReportController.getReportsByPageNumber);
        this.ROUTE.get(this.GET_REPORT, this.dailyReportController.getReport);
        this.ROUTE.delete(this.DELETE_REPORT, this.dailyReportController.deleteReport);
    }

}

const dailyReportApiRoute = new DailyReportApiRoute();

export {
    dailyReportApiRoute as DailyReportApiRoute,
};
