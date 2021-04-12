import { Router } from 'express';
import AuthController from '../../../controllers/AuthController';
import IRoute from '../../IRoute';
import AuthMiddleware from '../../../middlewares/AuthMiddleware';

class AuthApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/auth';
    public readonly LOGIN_URL: string = '/login';
    public readonly REGISTER_URL: string = '/register';
    public readonly LOGOUT_URL: string = '/logout';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.LOGIN_URL, AuthController.login);
        this.ROUTE.post(this.REGISTER_URL, AuthController.register);
        this.ROUTE.get(this.LOGOUT_URL, AuthMiddleware.isAuth, AuthController.logout);
    }
}

const authApiRoute = new AuthApiRoute();

export default authApiRoute;
