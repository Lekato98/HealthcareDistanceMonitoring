import { Router } from 'express';
import AuthController from '../controllers/auth/AuthController';
import IRoute from './IRoute';
import { Inject } from 'dependency-injection-v1';

class AuthRoute implements IRoute {
    @Inject(AuthController) private authController: AuthController;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/auth';
    public readonly REGISTRATION_URL: string = '/registration';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.REGISTRATION_URL, this.authController.registrationPage);
        this.ROUTE.get( '/forgetPassword' , (req,res) =>{
            res.render("forgetPassword");
        });
    }

}

const authRoute = new AuthRoute();

export default authRoute;
