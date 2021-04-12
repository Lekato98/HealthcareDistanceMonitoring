import { Router } from 'express';
import AuthApiRoute from './AuthApiRoute';
import IRoute from '../../IRoute';
import { UserApiRoute } from './UserApiRoute';
import { ReportApiRoute } from './report/ReportApiRoute';

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
    }
}

const apiRoute = new ApiRoute();

export default apiRoute;
