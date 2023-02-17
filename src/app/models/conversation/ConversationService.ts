import {DocumentType, mongoose} from "@typegoose/typegoose";
import ConversationModel, {Conversation, IConversation} from "./ConversationModel";
import UserModel from "../user/UserModel";

class ConversationService {
    public static async create(payload: IConversation): Promise<DocumentType<Conversation>> {
        const conversation = new Conversation(payload);
        return ConversationModel.create(conversation);
    }

    public static async getAllByUserId(userId: string): Promise<any[]> {
        const matchStage: mongoose.PipelineStage = {$match: {users: userId}};
        const lookupStage: mongoose.PipelineStage = {
            $lookup: {
                from: UserModel.collection.name,
                localField: 'users',
                foreignField: '_id',
                as: 'users'
            }
        };
        const projectStage: mongoose.PipelineStage = {$project: {'users.notifications': 0, 'users.password': 0}}
        const addLastMessageFieldStage: mongoose.PipelineStage = {
            $addFields: {
                lastMessage: {
                    $arrayElemAt: [ "$messages", -1 ]
                }
            }
        };
        const sortStage: mongoose.PipelineStage = {$sort: {'lastMessage.date': -1}};
        const pipeline: Array<mongoose.PipelineStage> = [matchStage, lookupStage, projectStage, addLastMessageFieldStage, sortStage];
        return (await ConversationModel.aggregate(pipeline)).map((conversation: any) => {
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
        // @ts-ignore
        return ConversationModel.updateOne({_id: conversationId}, {$push: {messages: messageBody}});
    }

    public static async getByUsers(users: string[]): Promise<any> {
        return ConversationModel.findOne({users});
    }

    public static async delete(conversationId: string): Promise<DocumentType<Conversation>> {
        return ConversationModel.findByIdAndDelete(conversationId);
    }

    public static async deleteAll(userId: string): Promise<any> {
        return ConversationModel.deleteMany({users: userId});
    }
}

export default ConversationService;
