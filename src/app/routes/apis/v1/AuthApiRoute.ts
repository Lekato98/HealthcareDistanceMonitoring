import { Router } from 'express';
import AuthController from '../../../controllers/auth/AuthController';
import IRoute from '../../IRoute';
import AuthMiddleware from '../../../middlewares/AuthMiddleware';
import { Inject } from 'dependency-injection-v1';

class AuthApiRoute implements IRoute {
    @Inject(AuthController) private readonly authController: AuthController;
    @Inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware;

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
        this.ROUTE.post(this.LOGIN_URL, this.authController.login);
        this.ROUTE.post(this.REGISTER_URL, this.authController.register);
        this.ROUTE.get(this.LOGOUT_URL, this.authMiddleware.isAuth, this.authController.logout);
    }
}

const authApiRoute = new AuthApiRoute();

export default authApiRoute;
