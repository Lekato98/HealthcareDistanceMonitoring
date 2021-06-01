import { Router } from 'express';
import HomeController from '../controllers/home/HomeController';
import IRoute from './IRoute';
import { Inject, Injectable } from 'dependency-injection-v1';

@Injectable
class HomeRoute implements IRoute {
    @Inject(HomeController) private static homeController: HomeController;

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
        this.ROUTE.get(this.HOME_PAGE_URL, HomeRoute.homeController.homePage);
        this.ROUTE.get(this.ADMIN_PAGE_URL, HomeRoute.homeController.adminPage);

        this.ROUTE.get('/emergency' , (req ,res) =>{
           res.render("emergency.ejs");
        });


        this.ROUTE.get('/Monitored-Patients' , (req ,res) =>{
            res.render("monitorPatients.ejs");
        });
        this.ROUTE.get('/questionnaire' , (req ,res) =>{
            res.render("questionnaire.ejs");
        });
        this.ROUTE.get('/allPatients' , (req ,res) =>{
            res.render("allPatients.ejs");
        });

        this.ROUTE.get('/reportList' , (req ,res) =>{
            res.render("reportList.ejs");
        });

            this.ROUTE.get('/hospitalization' , (req ,res) =>{
            res.render("hospitalization.ejs");
        });

        this.ROUTE.get('/editProfile' , (req ,res) =>{
            res.render("editProfile.ejs");
        });

        this.ROUTE.get('/coordinator' , (req ,res) =>{
            res.render("coordinator.ejs");
        });


        this.ROUTE.get(this.DEFAULT_PAGE_URL, HomeRoute.homeController.defaultPage);
    }
}

const homeRoute = new HomeRoute();

export default homeRoute;
