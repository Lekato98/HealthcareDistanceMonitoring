import IRoute from '../../../IRoute';
import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';
import MonitorController from '../../../../controllers/roles/monitor/MonitorController';

class MonitorApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/monitor';
    public readonly ADD_PATIENT: string = '/add-patient';

    @Inject(MonitorController) public readonly monitorController: MonitorController;

    constructor() {
        this.initialize();
    }

    initialize(): void {
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    initializeMiddlewares(): void {
    }

    initializeControllers(): void {
        this.ROUTE.post(this.ADD_PATIENT, this.monitorController.addPatient);
    }

}

const monitorApiRoute = new MonitorApiRoute();

export default monitorApiRoute;
