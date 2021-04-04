import { Request, Response } from 'express';

abstract class HomeController {
    public static async homePage(req: Request, res: Response): Promise<void> {
        res.render('home');
    }
}


export default HomeController;
