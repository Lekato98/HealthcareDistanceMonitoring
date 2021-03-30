import { Request, Response } from 'express';
import UserModel from '../models/UserModel';

abstract class HomeController {
    public static async homePageController(req: Request, res: Response) {
        res.render('home');
    }
}


export default HomeController;
