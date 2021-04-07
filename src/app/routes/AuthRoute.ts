import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import IRoute from './IRoute';

class AuthRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/auth';
    public readonly LOGIN_URL: string = '/login';
    public readonly REGISTER_URL: string = '/register';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.LOGIN_URL, AuthController.loginPage);
        this.ROUTE.get(this.REGISTER_URL, AuthController.loginPage);
    }
}

const authRoute = new AuthRoute();

export default authRoute;
