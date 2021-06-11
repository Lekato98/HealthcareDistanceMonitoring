import IRoute from '../../IRoute';
import { Router } from 'express';
import UserController from '../../../controllers/user/UserController';
import AuthMiddleware from '../../../middlewares/AuthMiddleware';
import { Inject } from 'dependency-injection-v1';
import { config } from '../../../../config/config';

class UserApiRoute implements IRoute {
    @Inject(UserController) private readonly userController: UserController;
    @Inject(AuthMiddleware) private readonly authMiddleware: AuthMiddleware;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/user';
    public readonly GET_USERS = '/users';
    public readonly GET_USER = '/:nationalId';
    public readonly CHANGE_AVATAR = '/change-avatar';
    public readonly PATCH_USER = '/';
    public readonly DELETE_USER = '/';
    public readonly ADD_NOTIFICATION = '/add-notification';
    public readonly REMOVE_NOTIFICATION = '/remove-notification/:index';
    public readonly PICTURE_FILE_NAME = 'picture';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.GET_USERS, this.userController.getUsersByPageNumber);
        this.ROUTE.get(this.GET_USER, this.userController.getUser);
        this.ROUTE.post(
            this.CHANGE_AVATAR, this.authMiddleware.isAuth,
            config.UPLOAD.single(this.PICTURE_FILE_NAME),
            this.userController.changePhoto,
        );
        this.ROUTE.patch(this.PATCH_USER, this.authMiddleware.isAuth, this.userController.updateUser);
        this.ROUTE.delete(this.DELETE_USER, this.authMiddleware.isAuth, this.userController.deleteUser);
        this.ROUTE.post(this.ADD_NOTIFICATION, this.authMiddleware.isAuth, this.userController.addNotification);
        this.ROUTE.delete(this.REMOVE_NOTIFICATION, this.authMiddleware.isAuth, this.userController.removeNotification);
    }
}

const userApiRoute = new UserApiRoute();

export {
    userApiRoute as UserApiRoute,
};

export default userApiRoute;
