import {Router} from 'express';
import HomeController from '../controllers/home/HomeController';
import IRoute from './IRoute';
import {Inject, Injectable} from 'dependency-injection-v1';
import HomeMiddleware from '../middlewares/HomeMiddleware';
import ConversationService from "../models/conversation/ConversationService";
import DailyReportMiddleware from "../middlewares/DailyReportMiddleware";

@Injectable
class HomeRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/';
    public readonly HOME_PAGE_URL: string = '/';
    public readonly NOT_FOUND_PAGE: string = '/404';
    public readonly SERVER_ERROR_PAGE: string = '/500';
    public readonly EMERGENCY_PAGE: string = '/emergency';
    public readonly MY_MONITORED_PATIENTS_PAGE: string = '/my-patients';
    public readonly QUESTIONNAIRE_PAGE: string = '/questionnaire';
    public readonly ALL_PATIENTS_PAGE: string = '/all-patients';
    public readonly REPORT_LIST_PAGE: string = '/report-list';
    public readonly EMERGENCY_CASES_PAGE: string = '/emergency-cases';
    public readonly COORDINATOR_PAGE: string = '/coordinator';
    public readonly CONVERSATIONS_PAGE: string = '/conversations';
    public readonly SPECIFIC_CONVERSATION_PAGE: string = '/conversations/:conversationId';
    public readonly MENTOR_LIST_PAGE: string = '/mentor-list';
    public readonly CREATE_ADVICE_PAGE: string = '/advice';
    public readonly DEFAULT_PAGE_URL: string = '/**';

    @Inject(HomeController) private homeController: HomeController;
    @Inject(HomeMiddleware) private homeMiddleware: HomeMiddleware;
    @Inject(DailyReportMiddleware) private dailyReportMiddleware: DailyReportMiddleware;

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeMiddleWares();
        this.initializeControllers();
    }

    public initializeMiddleWares(): void {
        this.ROUTE.use(this.homeMiddleware.isAuth);
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.HOME_PAGE_URL, this.homeMiddleware.preventAdmin, this.homeController.homePage);
        this.ROUTE.get(this.ALL_PATIENTS_PAGE, this.homeMiddleware.preventAdmin, this.homeController.allPatientsPage);
        this.ROUTE.get(this.EMERGENCY_CASES_PAGE, this.homeMiddleware.preventAdmin, this.homeController.emergencyCasesPage);
        this.ROUTE.get(this.QUESTIONNAIRE_PAGE,
            [this.homeMiddleware.preventAdmin, this.dailyReportMiddleware.isDailyReportAvailable],
            this.homeController.questionnairePage
        );
        this.ROUTE.get(this.REPORT_LIST_PAGE, this.homeMiddleware.preventAdmin, this.homeController.reportListPage);
        this.ROUTE.get(this.MY_MONITORED_PATIENTS_PAGE, this.homeMiddleware.preventAdmin, this.homeController.monitoredPatientsPage);
        this.ROUTE.get(this.EMERGENCY_PAGE, this.homeMiddleware.preventAdmin, this.homeController.emergencyPage);
        this.ROUTE.get(this.COORDINATOR_PAGE, this.homeMiddleware.isAdmin, this.homeController.coordinatorPage);
        this.ROUTE.get(this.CONVERSATIONS_PAGE, this.homeMiddleware.preventAdmin, this.homeController.conversationsPage);
        this.ROUTE.get(this.SPECIFIC_CONVERSATION_PAGE, this.homeMiddleware.preventAdmin, this.homeController.conversationPage);
        this.ROUTE.get(this.MENTOR_LIST_PAGE, this.homeMiddleware.preventAdmin, this.homeController.mentorListPage);
        this.ROUTE.get(this.CREATE_ADVICE_PAGE, this.homeMiddleware.preventAdmin, );

        this.ROUTE.get(this.NOT_FOUND_PAGE, this.homeController.notFoundPage);
        this.ROUTE.get(this.SERVER_ERROR_PAGE, this.homeController.serverErrorPage);
        this.ROUTE.get(this.DEFAULT_PAGE_URL, this.homeController.unknownRouteRedirect);
    }
}

const homeRoute = new HomeRoute();

export default homeRoute;
