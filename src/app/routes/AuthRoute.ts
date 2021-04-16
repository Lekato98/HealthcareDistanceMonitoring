import { Router } from 'express';
import AuthController from '../controllers/AuthController';
import IRoute from './IRoute';
import { Inject, Injectable } from 'dependency-injection-v1';

@Injectable
class AuthRoute implements IRoute {
    @Inject(AuthController) private static authController: AuthController;

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
        this.ROUTE.get(this.LOGIN_URL, AuthRoute.authController.loginPage);
        this.ROUTE.get(this.REGISTER_URL, AuthRoute.authController.loginPage);
    }
}

export default AuthRoute;
