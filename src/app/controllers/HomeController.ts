import { Request, Response } from 'express';

class HomeController {
    public async homePage(req: Request, res: Response): Promise<void> {
        res.render('home');
    }

    public async defaultPage(req: Request, res: Response): Promise<void> {
        res.render('home');
    }
}

const homeController = new HomeController();

export {
    homeController,
}
export default homeController;
