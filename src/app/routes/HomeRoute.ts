import { Router } from 'express';
import HomeController from '../controllers/HomeController';
import IRoute from './IRoute';

class HomeRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/';
    public readonly HOME_PAGE_URL: string = '/';
    public readonly DEFAULT_PAGE_URL: string = '/*';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.HOME_PAGE_URL, HomeController.homePage);
        this.ROUTE.get(this.DEFAULT_PAGE_URL, HomeController.defaultPage);
    }
}

const homeRoute = new HomeRoute();

export default homeRoute;
