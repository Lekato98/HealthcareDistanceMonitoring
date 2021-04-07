import { Router } from 'express';
import AuthApiRoute from './AuthApiRoute';
import IRoute from '../IRoute';
import ProfileApiRoute from '../apis/ProfileApiRoute';

class ApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/api';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeRoutes();
    }

    public initializeRoutes(): void {
        this.ROUTE.use(AuthApiRoute.ROUTE_PREFIX_URL, AuthApiRoute.ROUTE);
        this.ROUTE.use(ProfileApiRoute.ROUTE_PREFIX_URL, ProfileApiRoute.ROUTE);
    }
}

const apiRoute = new ApiRoute();

export default apiRoute;
