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
        const userA = req.app.locals.jwt._id;
        const userB = req.body.to;
        const payload = {users: [userA,  userB]};
        try {
            if (userA === userB) {
                const body = {success: UNSUCCESSFUL, message: 'Unable to create conversation with your self'};
                res.status(HttpStatusCode.BAD_REQUEST).json(body);
            } else {
                const conversation = await ConversationService.create(payload);
                const body = {success: SUCCESS, conversation};
                res.status(HttpStatusCode.CREATED_SUCCESSFULLY).json(body);
            }
        } catch (e: any) {
            if (e.message.startsWith('E11000')) {
                const conversation = await ConversationService.getByUsers(payload.users);
                const body = {success: SUCCESS, conversation};
                res.json(body);
            } else {
                const body = {success: UNSUCCESSFUL, message: e.message};
                res.status(HttpStatusCode.SERVER_ERROR).json(body);
            }
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
        } catch (e: any) {
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
            const userId = req.app.locals.jwt._id;
            const {conversationId, message} = req.body;
            const conversation = await ConversationService.addMessage(userId, conversationId, message);
            const body = {success: SUCCESS, conversation};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default ConversationController;