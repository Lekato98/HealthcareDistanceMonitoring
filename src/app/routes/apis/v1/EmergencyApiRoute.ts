import IRoute from '../../IRoute';
import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';
import EmergencyController from '../../../controllers/emergency/EmergencyController';

class EmergencyApiRoute implements IRoute {
    @Inject(EmergencyController) emergencyController: EmergencyController;

    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/emergency';
    public readonly GET_ALL_EMERGENCY: string = '/all';
    public readonly CREATE_EMERGENCY_CASE: string = '/';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.CREATE_EMERGENCY_CASE, this.emergencyController.createEmergencyCase);
        this.ROUTE.get(this.GET_ALL_EMERGENCY, this.emergencyController.getAll);
    }
}

const emergencyRoute = new EmergencyApiRoute();

export default emergencyRoute;
