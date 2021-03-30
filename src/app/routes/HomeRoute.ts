import { Router } from 'express';
import HomeController from '../controllers/HomeController';

abstract class HomeRoute {
    public static readonly ROUTE: Router = Router();
    public static readonly  HOME_PREFIX_URL: string = '/';

    public static initializeControllers(): void {
        this.ROUTE.get(this.HOME_PREFIX_URL, HomeController.homePageController);
    }
}

HomeRoute.initializeControllers();

export default HomeRoute;
