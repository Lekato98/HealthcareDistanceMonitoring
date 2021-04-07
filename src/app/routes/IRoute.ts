import { Router } from 'express';

interface IRoute {
    readonly ROUTE: Router;
    readonly ROUTE_PREFIX_URL: string;

    initialize(): void;
}

export default IRoute;
