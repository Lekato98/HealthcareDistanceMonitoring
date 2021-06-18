import {HttpStatusCode} from '../../utils/HttpUtils';
import {Request, Response} from 'express';
import RoleService from '../../models/roles/RoleService';
import {Injectable} from 'dependency-injection-v1';
import IRole from '../../models/roles/IRole';
import {IJWTPayload} from '../../utils/JWTUtils';
import AuthenticationUtils from '../../utils/AuthenticationUtils';
import {RoleName, roleType} from '../../models/user/UserModel';
import {SUCCESS, UNSUCCESSFUL} from '../../helpers/constants';

@Injectable
class RoleController {
    public async createRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.body;
            const userId: string = req.app.locals.jwt._id;
            const payload: IRole = {userId};
            const role = await RoleService.createRole(roleName, payload);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async deleteOneRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName, userId} = req.params;
            const {isAdmin = false} = req.app.locals.jwt;

            if (!isAdmin && userId !== req.app.locals.jwt._id) {
                const body = {success: UNSUCCESSFUL, message: 'Trying to delete another user role'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            } else {
                const role = await RoleService.deactivateOneRole(roleName, userId);
                const body = {success: SUCCESS, role};
                res.json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async deleteAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const {userId} = req.params;
            const {isAdmin = false} = req.app.locals;

            if (!isAdmin && userId !== req.app.locals.jwt._id) {
                const body = {success: UNSUCCESSFUL, message: 'Trying to delete another user role'};
                res.status(HttpStatusCode.FORBIDDEN).json(body);
            } else {
                const roles = await RoleService.deleteAllRoles(userId);
                const body = {success: SUCCESS, roles};
                res.json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async acceptRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName, userId} = req.body;
            const role = await RoleService.acceptByRoleName(roleName, userId);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async rejectRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName, userId} = req.body;
            const role = await RoleService.rejectByRoleName(roleName, userId);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getActiveRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getActiveByRoleName(roleName);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getInActiveRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getInActiveByRoleName(roleName);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getPendingRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getPendingByRoleName(roleName);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getAcceptedRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getAcceptedByRoleName(roleName);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getRejectedRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getRejectedByRoleName(roleName);
            const body = {success: SUCCESS, role};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async switchRole(req: Request, res: Response): Promise<void> {
        try {
            const roleName: roleType = req.body.roleName;

            if (roleName === RoleName.NO_ROLE) {
                return res.redirect('/api/v1/role/quit')
            }

            const oldJWTPayload: IJWTPayload = req.app.locals.jwt;
            const userRole = await RoleService.getUserRole(roleName, oldJWTPayload._id);

            if (userRole?.active) {
                const newJWTPayload: IJWTPayload = {...oldJWTPayload, roleName: roleName, roleId: userRole._id};
                AuthenticationUtils.setAuthCookies(res, newJWTPayload);
                const body = {success: SUCCESS, role: userRole};
                res.json(body);
            } else {
                const body = {
                    success: UNSUCCESSFUL,
                    message: 'you have to create your role before switch!',
                    roleName: RoleName.NO_ROLE,
                };
                res.status(HttpStatusCode.NOT_FOUND).json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async quitRoles(req: Request, res: Response): Promise<void> {
        try {
            const roleName: roleType = req.body.roleName;
            const oldJWTPayload: IJWTPayload = req.app.locals.jwt;
            const newJWTPayload: IJWTPayload = {...oldJWTPayload, roleName: roleName};
            AuthenticationUtils.setAuthCookies(res, newJWTPayload);
            const body = {success: SUCCESS, role: RoleName.NO_ROLE};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default RoleController;
