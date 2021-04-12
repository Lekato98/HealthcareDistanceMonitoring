import IRoute from '../../IRoute';
import { Router } from 'express';
import UserController from '../../../controllers/UserController';
import AuthMiddleware from '../../../middlewares/AuthMiddleware';

class UserApiRoute implements IRoute {
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
        this.ROUTE.get(this.GET_USERS, UserController.getUsersByPageNumber);
        this.ROUTE.get(this.GET_USER, UserController.getUser);
        this.ROUTE.patch(this.PATCH_USER, AuthMiddleware.isAuth, UserController.updateUser);
        this.ROUTE.delete(this.DELETE_USER, AuthMiddleware.isAuth, UserController.deleteUser);
    }
}

const userApiRoute = new UserApiRoute();

export {
    userApiRoute as UserApiRoute
}
