import IRoute from '../../../IRoute';
import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';

class DoctorApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/doctor';


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
    }

}

const doctorApiRoute = new DoctorApiRoute();

export default doctorApiRoute;
