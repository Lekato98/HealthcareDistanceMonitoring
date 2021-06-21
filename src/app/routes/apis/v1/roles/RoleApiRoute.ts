import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';
import RoleController from '../../../../controllers/roles/RoleController';
import AuthMiddleware from '../../../../middlewares/AuthMiddleware';
import IRoute from '../../../IRoute';

class RoleApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/role';
    public readonly CREATE_ROLE: string = '/';
    public readonly DELETE_ROLE: string = '/:roleName/:userId';
    public readonly DELETE_ALL_ROLES: string = '/all/:userId';
    public readonly GET_ACTIVE_ROLES: string = '/active/:roleName';
    public readonly GET_IN_ACTIVE_ROLES: string = '/in-active/:roleName';
    public readonly GET_PENDING_ROLES: string = '/pending/:roleName';
    public readonly GET_ACCEPTED_ROLES: string = '/accepted/:roleName';
    public readonly GET_REJECTED_ROLES: string = '/rejected/:roleName';
    public readonly ACCEPT_ROLE: string = '/accept';
    public readonly REJECT_ROLE: string = '/reject';
    public readonly SWITCH_ROLE: string = '/switch';
    public readonly QUIT_ROLES: string = '/quit';

    @Inject(RoleController) private roleController: RoleController;
    @Inject(AuthMiddleware) private authMiddleware: AuthMiddleware;

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public initializeMiddlewares(): void {
        this.ROUTE.use(this.authMiddleware.isAuth);
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.CREATE_ROLE, this.roleController.createRole);
        this.ROUTE.delete(this.DELETE_ALL_ROLES, this.roleController.deleteAllRoles);
        this.ROUTE.delete(this.DELETE_ROLE, this.roleController.deleteOneRole);
        this.ROUTE.get(this.GET_ACTIVE_ROLES, this.roleController.getActiveRoles);
        this.ROUTE.get(this.GET_IN_ACTIVE_ROLES, this.roleController.getInActiveRoles);
        this.ROUTE.get(this.GET_ACCEPTED_ROLES, this.roleController.getAcceptedRoles);
        this.ROUTE.get(this.GET_REJECTED_ROLES, this.roleController.getRejectedRoles);
        this.ROUTE.get(this.GET_PENDING_ROLES, this.roleController.getPendingRoles);
        this.ROUTE.patch(this.ACCEPT_ROLE, this.roleController.acceptRole);
        this.ROUTE.patch(this.REJECT_ROLE, this.roleController.rejectRole);
        this.ROUTE.put(this.SWITCH_ROLE, this.roleController.switchRole);
        this.ROUTE.put(this.QUIT_ROLES, this.roleController.quitRoles);
    }
}

const roleApiRoute = new RoleApiRoute();

export default roleApiRoute;
