import IRoute from '../../../IRoute';
import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';
import MonitorController from '../../../../controllers/roles/monitor/MonitorController';
import MonitorMiddleware from '../../../../middlewares/MonitorMiddleware';
import AuthMiddleware from '../../../../middlewares/AuthMiddleware';

class MonitorApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/monitor';
    public readonly ADD_PATIENT: string = '/add-patient';
    public readonly REMOVE_PATIENT: string = '/remove-patient';
    public readonly MY_PATIENTS: string = '/my-patients';

    @Inject(MonitorController) public readonly monitorController: MonitorController;
    @Inject(MonitorMiddleware) public readonly monitorMiddleware: MonitorMiddleware;
    @Inject(AuthMiddleware) public readonly authMiddleware: AuthMiddleware;

    constructor() {
        this.initialize();
    }

    initialize(): void {
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    initializeMiddlewares(): void {
        this.ROUTE.use(this.authMiddleware.isAuth);
        this.ROUTE.use(this.monitorMiddleware.isMonitor);
    }

    initializeControllers(): void {
        this.ROUTE.post(this.ADD_PATIENT, this.monitorController.addPatient);
        this.ROUTE.patch(this.REMOVE_PATIENT, this.monitorController.removePatient);
        this.ROUTE.get(this.MY_PATIENTS, this.monitorController.getMyPatients);
    }

}

const monitorApiRoute = new MonitorApiRoute();

export default monitorApiRoute;
