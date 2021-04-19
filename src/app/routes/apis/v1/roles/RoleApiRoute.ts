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
    public readonly DELETE_ROLE: string = '/:roleName';
    public readonly DELETE_ALL_ROLES: string = '/all';
    public readonly GET_ACTIVE_ROLES: string = '/active/:roleName';
    public readonly GET_IN_ACTIVE_ROLES: string = '/in-active/:roleName';
    public readonly GET_PENDING_ROLES: string = '/pending/:roleName';
    public readonly GET_ACCEPTED_ROLES: string = '/accepted/:roleName';
    public readonly GET_REJECTED_ROLES: string = '/rejected/:roleName';
    public readonly ACCEPT_ROLE: string = '/accept';
    public readonly REJECT_ROLE: string = '/reject';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.CREATE_ROLE, this.authMiddleware.isAuth, this.roleController.createRole);
        this.ROUTE.delete(this.DELETE_ALL_ROLES, this.authMiddleware.isAuth, this.roleController.deleteAllRoles);
        this.ROUTE.delete(this.DELETE_ROLE, this.authMiddleware.isAuth, this.roleController.deleteOneRole);
        this.ROUTE.get(this.GET_ACTIVE_ROLES, this.authMiddleware.isAuth, this.roleController.getActiveRoles);
        this.ROUTE.get(this.GET_IN_ACTIVE_ROLES, this.authMiddleware.isAuth, this.roleController.getInActiveRoles);
        this.ROUTE.get(this.GET_ACCEPTED_ROLES, this.authMiddleware.isAuth, this.roleController.getAcceptedRoles);
        this.ROUTE.get(this.GET_REJECTED_ROLES, this.authMiddleware.isAuth, this.roleController.getRejectedRoles);
        this.ROUTE.get(this.GET_PENDING_ROLES, this.authMiddleware.isAuth, this.roleController.getPendingRoles);
        this.ROUTE.patch(this.ACCEPT_ROLE, this.authMiddleware.isAuth, this.roleController.acceptRole);
        this.ROUTE.patch(this.REJECT_ROLE, this.authMiddleware.isAuth, this.roleController.rejectRole);
    }
}

const roleApiRoute = new RoleApiRoute();

export default roleApiRoute;
