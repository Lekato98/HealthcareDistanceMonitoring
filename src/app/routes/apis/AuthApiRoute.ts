import { Router } from 'express';
import AuthController from '../../controllers/AuthController';
import IRoute from '../IRoute';

class AuthApiRoute implements IRoute {
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
        this.ROUTE.post(this.LOGIN_URL, AuthController.login);
        this.ROUTE.post(this.REGISTER_URL, AuthController.register);
    }
}

const authApiRoute = new AuthApiRoute();

export default authApiRoute;
