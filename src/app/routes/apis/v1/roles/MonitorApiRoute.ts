import IRoute from '../../../IRoute';
import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';

class MonitorApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/monitor';

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

const monitorApiRoute = new MonitorApiRoute();

export default monitorApiRoute;
