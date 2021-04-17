import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';
import RoleController from '../../../../controllers/roles/RoleController';
import AuthMiddleware from '../../../../middlewares/AuthMiddleware';
import IRoute from '../../../IRoute';

class RoleApiRoute implements IRoute {
    @Inject(RoleController) private roleController: RoleController;
    @Inject(AuthMiddleware) private authMiddleware: AuthMiddleware;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/role';
    public readonly CREATE_ROLE: string = '/';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.CREATE_ROLE, this.authMiddleware.isAuth, this.roleController.createRole);
    }
}

const roleApiRoute = new RoleApiRoute();

export default roleApiRoute;
