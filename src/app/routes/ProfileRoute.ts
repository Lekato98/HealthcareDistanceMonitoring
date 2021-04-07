import IRoute from './IRoute';
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';

class ProfileRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/profile';
    public readonly PROFILE_PAGE_URL: string = '/';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        this.ROUTE.get(this.PROFILE_PAGE_URL, ProfileController.profilePage);
    }
}

const profileRoute = new ProfileRoute();

export default profileRoute;
