import { Router } from 'express';
import AuthController from '../../controllers/AuthController';

abstract class AuthRoute {
    public static readonly ROUTE: Router = Router();
    public static readonly ROUTE_PREFIX_URL: string = '/auth';
    public static readonly LOGIN_URL: string = '/login';
    public static readonly REGISTER_URL: string = '/register';

    public static initialize(): void {
        this.initializeControllers();
    }

    public static initializeControllers(): void {
        this.ROUTE.post(this.LOGIN_URL, AuthController.login);
        this.ROUTE.post(this.REGISTER_URL, AuthController.register);
    }
}

AuthRoute.initialize();

export default AuthRoute;
