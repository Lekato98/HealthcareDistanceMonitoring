import { Router } from 'express';
import HomeController from '../controllers/HomeController';

abstract class HomeRoute {
    public static readonly ROUTE: Router = Router();
    public static readonly ROUTE_PREFIX_URL: string = '/';
    public static readonly HOME_PAGE_URL: string = '/';

    public static initialize(): void {
        this.initializeControllers();
    }

    public static initializeControllers(): void {
        this.ROUTE.get(this.HOME_PAGE_URL, HomeController.homePage);
    }
}

HomeRoute.initialize();

export default HomeRoute;
