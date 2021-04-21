import IRoute from './IRoute';
import { Router } from 'express';
import UserController from '../controllers/user/UserController';
import { Inject } from 'dependency-injection-v1';

class UserRoute implements IRoute {
    @Inject(UserController) private static userController: UserController;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/profile';
    public readonly PROFILE_PAGE_URL: string = '/:nationalId';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.PROFILE_PAGE_URL, UserRoute.userController.userProfilePage);
    }
}

const profileRoute = new UserRoute();

export default profileRoute;
