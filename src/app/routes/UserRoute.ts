import IRoute from './IRoute';
import { Router } from 'express';
import UserController from '../controllers/user/UserController';
import { Inject } from 'dependency-injection-v1';
import HomeMiddleware from '../middlewares/HomeMiddleware';

class UserRoute implements IRoute {
    @Inject(UserController) private userController: UserController;
    @Inject(HomeMiddleware) private homeMiddleware: HomeMiddleware;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/profile';
    public readonly PROFILE_PAGE_URL: string = '/:nationalId';
    public readonly EDIT_PROFILE_PAGE: string = '/edit';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public initializeMiddlewares(): void {
        this.ROUTE.use(this.homeMiddleware.isAuth);
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.EDIT_PROFILE_PAGE, this.userController.editProfilePage);
        this.ROUTE.get(this.PROFILE_PAGE_URL, this.userController.profilePage);
    }
}

const userRoute = new UserRoute();

export default userRoute;
