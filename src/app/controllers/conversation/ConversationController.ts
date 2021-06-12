import {Injectable} from "dependency-injection-v1";
import {Request, Response} from "express";
import {SUCCESS, UNSUCCESSFUL} from "../../helpers/constants";
import {HttpStatusCode} from "../../utils/HttpUtils";
import ConversationService from "../../models/conversation/ConversationService";

@Injectable
class ConversationController {
    /**
     * @Route /api/v1/conversation/create
     * @POST
     * */
    public async createConversation(req: Request, res: Response): Promise<void> {
        try {
            const userA = req.app.locals.jwt._id;
            const userB = req.body.to;
            const payload = {users: [userA,  userB]};
            const conversation = await ConversationService.create(payload);
            const body = {success: SUCCESS, conversation};
            res.status(HttpStatusCode.CREATED_SUCCESSFULLY).json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/conversation/:userId
     * @GET
     * */
    public async getAllConversationsByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.userId;
            const conversations = await ConversationService.getAllByUserId(userId);
            const body = {success: SUCCESS, conversations};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/conversation/message
     * @POST
     * */
    public async addMessage(req: Request, res: Response): Promise<void> {
        try {
            const {conversationId, message} = req.body;
            const conversation = await ConversationService.addMessage(conversationId, message);
            const body = {success: SUCCESS, conversation};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default ConversationController;