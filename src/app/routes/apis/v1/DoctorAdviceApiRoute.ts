import { Router } from 'express';
import IRoute from '../../IRoute';
import {Inject} from "dependency-injection-v1";
import AuthMiddleware from "../../../middlewares/AuthMiddleware";
import ConversationController from "../../../controllers/conversation/ConversationController";
import DoctorAdviceController from "../../../controllers/doctor-advice/DoctorAdviceController";

class DoctorAdviceApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/doctor-advice';
    public readonly CREATE_ADVICE: string = '/create';
    public readonly GET_ALL: string = '/all';

    @Inject(AuthMiddleware) authMiddleware: AuthMiddleware;
    @Inject(DoctorAdviceController) doctorAdviceController: DoctorAdviceController;

    constructor() {
        this.initialize();
    }

    public initialize(): void {
        this.initializeMiddlewares();
        this.initializeControllers();
    }

    public initializeMiddlewares(): void {
        this.ROUTE.use(this.authMiddleware.isAuth);
    }

    public initializeControllers(): void {
        this.ROUTE.post(this.CREATE_ADVICE, this.doctorAdviceController.create);
        this.ROUTE.get(this.GET_ALL, this.doctorAdviceController.getAll);
    }
}

const doctorAdviceApiRoute = new DoctorAdviceApiRoute();

export default doctorAdviceApiRoute;
