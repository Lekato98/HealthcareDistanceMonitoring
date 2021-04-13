import { Request, Response } from 'express';
import {Injectable} from 'dependency-injection-v1';

@Injectable
class HomeController {
    public async homePage(req: Request, res: Response): Promise<void> {
        res.render('home');
    }

    public async defaultPage(req: Request, res: Response): Promise<void> {
        res.render('home');
    }
}

export default HomeController;
