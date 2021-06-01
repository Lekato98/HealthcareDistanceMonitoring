import IRoute from '../../../IRoute';
import { Router } from 'express';
import { Inject } from 'dependency-injection-v1';
import PatientController from '../../../../controllers/roles/patient/PatientController';
import PatientMiddleware from '../../../../middlewares/PatientMiddleware';

class PatientApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/patient';
    public readonly PATIENT_BY_USER_ID = '/:userId';
    public readonly PATIENTS_LIST = '/all';
    public readonly MONITORED_PATIENTS = '/monitored';
    public readonly UNMONITORED_PATIENTS = '/unmonitored';
    public readonly SEARCH_PATIENTS_BY_NATIONAL_ID = '/search';

    @Inject(PatientController) patientController: PatientController;
    @Inject(PatientMiddleware) patientMiddleware: PatientMiddleware;

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
        this.ROUTE.get(this.PATIENTS_LIST, this.patientController.getPatientsByPageNumber);
        this.ROUTE.get(this.SEARCH_PATIENTS_BY_NATIONAL_ID, this.patientController.searchPatients);
        this.ROUTE.get(this.MONITORED_PATIENTS, this.patientController.getMonitoredPatientsByPageNumber);
        this.ROUTE.get(this.UNMONITORED_PATIENTS, this.patientController.getUnmonitoredPatientsByPageNumber);
        this.ROUTE.get(this.PATIENT_BY_USER_ID, this.patientController.getPatientByUserId);
    }

}

const patientApiRoute = new PatientApiRoute();

export default patientApiRoute;
