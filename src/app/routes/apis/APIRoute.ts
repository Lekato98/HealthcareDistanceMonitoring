import { Router } from 'express';
import AuthRoute from './AuthRoute';

abstract class APIRoute {
    public static readonly ROUTE: Router = Router();
    public static readonly ROUTE_PREFIX_URL: string = '/api';

    public static initialize(): void {
        this.initializeRoutes();
        this.initializeControllers();
    }

    public static initializeRoutes(): void {
        this.ROUTE.use(AuthRoute.ROUTE_PREFIX_URL, AuthRoute.ROUTE);
    }

    public static initializeControllers(): void {

    }
}

APIRoute.initialize();

export default APIRoute;
