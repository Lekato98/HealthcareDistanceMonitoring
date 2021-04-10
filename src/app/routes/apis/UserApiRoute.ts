import IRoute from '../IRoute';
import { Router } from 'express';
import UserController from '../../controllers/UserController';

class UserApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/user';
    public readonly GET_USERS = '/users';
    public readonly GET_USER = '/:nationalId';
    public readonly PATCH_USER = '/';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        // this.ROUTE.use(AuthMiddleware.setAuth);
        this.ROUTE.get(this.GET_USERS, UserController.getAllUsers);
        this.ROUTE.get(this.GET_USER, UserController.getUser);
        this.ROUTE.patch(this.PATCH_USER, UserController.updateUser);
    }
}

const userApiRoute = new UserApiRoute();

export {
    userApiRoute as UserApiRoute
}
