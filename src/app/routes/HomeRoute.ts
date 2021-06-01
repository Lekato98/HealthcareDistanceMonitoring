import { Router } from 'express';
import HomeController from '../controllers/home/HomeController';
import IRoute from './IRoute';
import { Inject, Injectable } from 'dependency-injection-v1';

@Injectable
class HomeRoute implements IRoute {
    @Inject(HomeController) private homeController: HomeController;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/';
    public readonly HOME_PAGE_URL: string = '/';
    public readonly ADMIN_PAGE_URL: string = '/admin';
    public readonly DEFAULT_PAGE_URL: string = '/**';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeMiddleWares();
        this.initializeControllers();
    }

    public initializeMiddleWares(): void {
        // this.ROUTE.use();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.HOME_PAGE_URL, this.homeController.homePage);
        this.ROUTE.get(this.ADMIN_PAGE_URL, this.homeController.adminPage);
        this.ROUTE.get(this.DEFAULT_PAGE_URL, this.homeController.defaultPage);
    }
}

const homeRoute = new HomeRoute();

export default homeRoute;
