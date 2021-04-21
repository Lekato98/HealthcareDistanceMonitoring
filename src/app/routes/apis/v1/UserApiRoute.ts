import IRoute from '../../IRoute';
import { Router } from 'express';
import UserController from '../../../controllers/user/UserController';
import AuthMiddleware from '../../../middlewares/AuthMiddleware';
import { Inject } from 'dependency-injection-v1';

class UserApiRoute implements IRoute {
    @Inject(UserController) private static readonly userController: UserController;
    @Inject(AuthMiddleware) private static readonly authMiddleware: AuthMiddleware;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/user';
    public readonly GET_USERS = '/users';
    public readonly GET_USER = '/:nationalId';
    public readonly PATCH_USER = '/';
    public readonly DELETE_USER = '/';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.GET_USERS, UserApiRoute.userController.getUsersByPageNumber);
        this.ROUTE.get(this.GET_USER, UserApiRoute.userController.getUser);
        this.ROUTE.patch(this.PATCH_USER, UserApiRoute.authMiddleware.isAuth, UserApiRoute.userController.updateUser);
        this.ROUTE.delete(this.DELETE_USER, UserApiRoute.authMiddleware.isAuth, UserApiRoute.userController.deleteUser);
    }
}

const userApiRoute = new UserApiRoute();

export {
    userApiRoute as UserApiRoute,
};

export default userApiRoute;
