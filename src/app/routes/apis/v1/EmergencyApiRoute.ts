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
    public readonly HOSPITALIZE: string = '/hospitalize/:emergencyId';
    public readonly REMOVE_CASE: string = '/:emergencyId';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.CREATE_EMERGENCY_CASE, this.emergencyController.createEmergencyCase);
        this.ROUTE.get(this.GET_ALL_EMERGENCY, this.emergencyController.getAll);
        this.ROUTE.delete(this.HOSPITALIZE, this.emergencyController.hospitalize);
        this.ROUTE.delete(this.REMOVE_CASE, this.emergencyController.removeCase);
    }
}

const emergencyRoute = new EmergencyApiRoute();

export default emergencyRoute;
