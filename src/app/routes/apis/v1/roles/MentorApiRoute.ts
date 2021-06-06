import IRoute from '../../../IRoute';
import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';
import MentorController from '../../../../controllers/roles/mentor/MentorController';
import MentorMiddleware from '../../../../middlewares/MentorMiddleware';
import AuthMiddleware from '../../../../middlewares/AuthMiddleware';

class MentorApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/mentor';
    public readonly ADD_PATIENT: string = '/add-patient';
    public readonly REMOVE_PATIENT: string = '/remove-patient';
    public readonly MY_PATIENTS: string = '/my-patients';

    @Inject(MentorController) public readonly mentorController: MentorController;
    @Inject(MentorMiddleware) public readonly mentorMiddleware: MentorMiddleware;
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
        this.ROUTE.use(this.mentorMiddleware.isMentor);
    }

    initializeControllers(): void {
        this.ROUTE.post(this.ADD_PATIENT, this.mentorController.addPatient);
        this.ROUTE.patch(this.REMOVE_PATIENT, this.mentorController.removePatient);
        this.ROUTE.get(this.MY_PATIENTS, this.mentorController.getMyPatients);
    }

}

const mentorApiRoute = new MentorApiRoute();

export default mentorApiRoute;
