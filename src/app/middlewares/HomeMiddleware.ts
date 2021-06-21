import { Injectable } from 'dependency-injection-v1';
import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../utils/HttpUtils';
import UserService from '../models/user/UserService';
import { RoleName } from '../models/user/UserModel';
import AdminModel from '../models/admin/AdminModel';
import RoleService from "../models/roles/RoleService";

@Injectable
class HomeMiddleware {
    public async isAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.locals.role = RoleName.NO_ROLE;
            const userId: string = req.app.locals.jwt?._id;
            const nationalId: string = req.app.locals.jwt?.nationalId;
            const user = await UserService.findByNationalId(nationalId);
            if (user && user._id === userId) {
                res.locals.me && (res.locals.me.roles = await RoleService.getUserRoles(userId));
                res.locals.role = req.app.locals.jwt?.roleName || RoleName.NO_ROLE;
                next();
            } else {
                const admin = await AdminModel.findOne({_id: userId});
                if (admin) {
                    res.locals.isAdmin = true;
                    next();
                } else {
                    res.redirect('/auth/registration');
                }
            }
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).render('500');
        }
    }

    public async isAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        if (!req.app.locals.jwt?.isAdmin) {
            res.status(HttpStatusCode.FORBIDDEN).redirect('/');
        } else {
            next();
        }
    }

    public preventAdmin(req: Request, res: Response, next: NextFunction): void {
        if (req.app.locals.jwt?.isAdmin) {
            res.redirect('/coordinator');
        } else {
            next();
        }
    }
}

export default HomeMiddleware;
