import IRoute from '../IRoute';
import { Router } from 'express';
import ProfileController from '../../controllers/ProfileController';

class ProfileApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/profile';
    public readonly CREATE_PATIENT_PROFILE_URL: string = '/create-patient';
    public readonly CREATE_MONITOR_PROFILE_URL: string = '/create-monitor';
    public readonly CREATE_DOCTOR_PROFILE_URL: string = '/create-doctor';

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeControllers();
    }

    public initializeControllers(): void {
        // this.ROUTE.use(AuthMiddleware.setAuth);
        this.ROUTE.post(this.CREATE_PATIENT_PROFILE_URL, ProfileController.createPatientProfile);
        this.ROUTE.post(this.CREATE_MONITOR_PROFILE_URL, ProfileController.createMonitorProfile);
        this.ROUTE.post(this.CREATE_DOCTOR_PROFILE_URL, ProfileController.createDoctorProfile);
    }
}

const profileApiRoute = new ProfileApiRoute();

export default profileApiRoute;
