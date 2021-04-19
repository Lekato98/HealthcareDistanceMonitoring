import { HttpStatusCode } from '../../utils/HttpUtils';
import { Request, Response } from 'express';
import RoleService from '../../models/roles/RoleService';
import { Injectable } from 'dependency-injection-v1';
import IRole from '../../models/roles/IRole';

@Injectable
class RoleController {
    public async createRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.body;
            const userId: string = res.locals.jwt._id;
            const payload: IRole = {userId};
            const role = await RoleService.createRole(roleName, payload);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async deleteOneRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const userId = res.locals.jwt._id;
            const role = await RoleService.deleteOneRole(roleName, userId);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async deleteAllRoles(req: Request, res: Response): Promise<void> {
        try {
            const userId = res.locals.jwt._id;
            const roles = await RoleService.deleteAllRoles(userId);
            const body = {success: 1, roles};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async acceptRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName, userId} = req.body;
            const role = await RoleService.acceptByRoleName(roleName, userId);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async rejectRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName, userId} = req.body;
            const role = await RoleService.rejectByRoleName(roleName, userId);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getActiveRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getActiveByRoleName(roleName);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getInActiveRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getInActiveByRoleName(roleName);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getPendingRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getPendingByRoleName(roleName);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getAcceptedRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getAcceptedByRoleName(roleName);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    public async getRejectedRoles(req: Request, res: Response): Promise<void> {
        try {
            const {roleName} = req.params;
            const role = await RoleService.getRejectedByRoleName(roleName);
            const body = {success: 1, role};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default RoleController;
