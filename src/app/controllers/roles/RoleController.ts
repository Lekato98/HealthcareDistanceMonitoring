import { HttpStatusCode } from '../../utils/HttpUtils';
import { Request, Response } from 'express';
import RoleService from '../../models/roles/RoleService';
import { Injectable } from 'dependency-injection-v1';
import IRole from '../../models/roles/IRole';

@Injectable
class RoleController {
    public async createRole(req: Request, res: Response): Promise<void> {
        try {
            const {roleName, active} = req.body;
            const userId: string = res.locals.jwt._id;
            const payload: IRole = {userId, active};
            const role = await RoleService.createRole(roleName, payload);
            res.json(role);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default RoleController;
