import { Router } from 'express';
import IRoute from '../../IRoute';
import {Inject} from "dependency-injection-v1";
import AuthMiddleware from "../../../middlewares/AuthMiddleware";
import ConversationController from "../../../controllers/conversation/ConversationController";

class ConversationApiRoute implements IRoute {
    public readonly ROUTE: Router = Router();
    public readonly ROUTE_PREFIX_URL: string = '/conversation';
    public readonly CREATE_CONVERSATION: string = '/create';
    public readonly ADD_MESSAGE: string = '/message';
    public readonly CONVERSATIONS_BY_USER_ID: string = '/:userId';

    @Inject(AuthMiddleware) authMiddleware: AuthMiddleware;
    @Inject(ConversationController) conversationController: ConversationController;

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
        this.ROUTE.post(this.ADD_MESSAGE, this.conversationController.addMessage);
        this.ROUTE.post(this.CREATE_CONVERSATION, this.conversationController.createConversation);
        this.ROUTE.get(this.CONVERSATIONS_BY_USER_ID, this.conversationController.getAllConversationsByUserId);
    }
}

const conversationApiRoute = new ConversationApiRoute();

export default conversationApiRoute;
