import { Request, Response } from 'express';
import UserModel from '../models/UserModel';

abstract class HomeController {
    public static async homePage(req: Request, res: Response): Promise<void> {
        res.render('home');
    }
}


export default HomeController;
