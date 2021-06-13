import {DocumentType} from "@typegoose/typegoose";
import ConversationModel, {Conversation, IConversation} from "./ConversationModel";
import UserModel from "../user/UserModel";

class ConversationService {
    public static async create(payload: IConversation): Promise<DocumentType<Conversation>> {
        const conversation = new Conversation(payload);
        return ConversationModel.create(conversation);
    }

    public static async getAllByUserId(userId: string): Promise<any[]> {
        const matchStage = {$match: {users: userId}};
        const lookupStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'users',
                foreignField: '_id',
                as: 'users'
            }
        };
        const projectStage = {$project: {'users.notifications': 0, 'users.password': 0}}
        const pipeline = [matchStage, lookupStage, projectStage];
        return (await ConversationModel.aggregate(pipeline)).map(conversation => {
            if (conversation.users[1]._id === userId) {
                [conversation.users[0], conversation.users[1]]
                    = [conversation.users[1], conversation.users[0]];
            }

            return conversation;
        });
    }

    public static async addMessage(userId: string, conversationId: string, message: string): Promise<any> {
        const messageBody = {
            message,
            date: new Date(),
            from: userId,
        };
        return ConversationModel.updateOne({_id: conversationId}, {$push: {messages: messageBody}});
    }

    public static async delete(conversationId: string): Promise<DocumentType<Conversation>> {
        return ConversationModel.findByIdAndDelete(conversationId);
    }

    public static async deleteAll(userId: string): Promise<any> {
        return ConversationModel.deleteMany({users: userId});
    }
}

export default ConversationService;
