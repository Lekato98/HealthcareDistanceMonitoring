import { Request, Response } from 'express';
import { Injectable } from 'dependency-injection-v1';
import { HttpStatusCode } from '../../utils/HttpUtils';
import RoleService from '../../models/roles/RoleService';

@Injectable
class HomeController {
    public async homePage(req: Request, res: Response): Promise<void> {
        try {
            res.render('home');
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
