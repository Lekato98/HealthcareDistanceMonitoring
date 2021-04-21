import { Router } from 'express';
import AuthController from '../controllers/auth/AuthController';
import IRoute from './IRoute';
import { Inject, Injectable } from 'dependency-injection-v1';

class AuthRoute implements IRoute {
    @Inject(AuthController) private static authController: AuthController;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/auth';
    public readonly LOGIN_URL: string = '/login';
    public readonly REGISTER_URL: string = '/registration';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.LOGIN_URL, AuthRoute.authController.loginPage);
        this.ROUTE.get(this.REGISTER_URL, AuthRoute.authController.registerPage);
    }
}

const authRoute = new AuthRoute();

export default authRoute;
