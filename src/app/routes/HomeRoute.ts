import { Router } from 'express';
import HomeController from '../controllers/home/HomeController';
import IRoute from './IRoute';
import { Inject, Injectable } from 'dependency-injection-v1';
import RoleService from '../models/roles/RoleService';
import { RoleName } from '../models/user/UserModel';
import PatientService from '../models/roles/patient/PatientService';

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

        this.ROUTE.get('/emergency' , (req ,res) =>{

            res.render("emergency.ejs");
        });


        this.ROUTE.get('/Monitored-Patients' , (req ,res) =>{
            res.render("monitorPatients.ejs");
        });
        this.ROUTE.get('/questionnaire' , (req ,res) =>{
            res.render("questionnaire.ejs");
        });
        this.ROUTE.get('/allPatients' , async (req ,res) =>{
            const allPatients = await PatientService.getPatientsByPageNumber(0);
            res.render("allPatients.ejs", {allPatients});
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

        this.ROUTE.get('/coordinator' , async (req ,res) =>{
            const doctors = await RoleService.getActiveByRoleName(RoleName.DOCTOR);
            const monitors = await RoleService.getActiveByRoleName(RoleName.MONITOR);
            const pendingDoctors = await RoleService.getPendingByRoleName(RoleName.DOCTOR);
            const pendingMonitors = await RoleService.getPendingByRoleName(RoleName.MONITOR);

            res.render("coordinator.ejs", {doctors, monitors, pendingDoctors, pendingMonitors});
        });

        this.ROUTE.get(this.DEFAULT_PAGE_URL, this.homeController.defaultPage);
    }
}

const homeRoute = new HomeRoute();

export default homeRoute;
