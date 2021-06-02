import { Router } from 'express';
import AuthApiRoute from './AuthApiRoute';
import IRoute from '../../IRoute';
import { UserApiRoute } from './UserApiRoute';
import { ReportApiRoute } from './report/ReportApiRoute';
import RoleApiRoute from './roles/RoleApiRoute';
import PatientApiRoute from  './roles/PatientApiRoute';
import EmergencyApiRoute from './EmergencyApiRoute';
import MonitorApiRoute from './roles/MonitorApiRoute';

class ApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/api/v1';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.ROUTE.use(AuthApiRoute.ROUTE_PREFIX_URL, AuthApiRoute.ROUTE); // /auth
        this.ROUTE.use(UserApiRoute.ROUTE_PREFIX_URL, UserApiRoute.ROUTE); // /user
        this.ROUTE.use(ReportApiRoute.ROUTE_PREFIX_URL, ReportApiRoute.ROUTE); // /report
        this.ROUTE.use(RoleApiRoute.ROUTE_PREFIX_URL, RoleApiRoute.ROUTE); // /role
        this.ROUTE.use(PatientApiRoute.ROUTE_PREFIX_URL, PatientApiRoute.ROUTE); // /patient
        this.ROUTE.use(MonitorApiRoute.ROUTE_PREFIX_URL, MonitorApiRoute.ROUTE); // /monitor
        this.ROUTE.use(EmergencyApiRoute.ROUTE_PREFIX_URL, EmergencyApiRoute.ROUTE); // /emergency
    }
}

const apiRoute = new ApiRoute();

export default apiRoute;
