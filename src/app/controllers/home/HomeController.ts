import { Request, Response } from 'express';
import { Injectable } from 'dependency-injection-v1';
import { HttpStatusCode } from '../../utils/HttpUtils';
import UserService from '../../models/user/UserService';
import RoleService from '../../models/roles/RoleService';

@Injectable
class HomeController {
    public async homePage(req: Request, res: Response): Promise<void> {
        try {
            const nationalId: string = req.app.locals.jwt?.nationalId;
            const user = nationalId && await UserService.findByNationalId(nationalId);
            res.render('home', {user});
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).send(e.message);
        }
    }

    public async adminPage(req: Request, res: Response): Promise<void> {
        try {
            const doctors = await RoleService.getActiveByRoleName('doctor');
            res.render('admin', {doctors});
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).send(e.message);
        }
    }

    public async defaultPage(req: Request, res: Response): Promise<void> {
        res.redirect('/');
    }
}

export default HomeController;
