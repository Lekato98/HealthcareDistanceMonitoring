import {DocumentType, mongoose} from '@typegoose/typegoose';
import UserModelUtils from './UserModelUtils';
import UserModel, {ISecurity, IUser, RoleName, User} from './UserModel';
import RoleService from '../roles/RoleService';
import UserModelHooks from './UserModelHooks';
import {ILogin} from '../../controllers/auth/AuthController';
import ConversationService from "../conversation/ConversationService";

const bcrypt = require('bcrypt');

class UserService {
    public static readonly USERS_LIMIT_PER_PAGE: number = 20; // used for get all users
    public static readonly MALE_DEFAULT_AVATAR = 'https://res.cloudinary.com/ddk75efat/image/upload/v1623369927/x0meteg69vavr1jbsxwv.jpg';
    public static readonly FEMALE_DEFAULT_AVATAR = 'https://res.cloudinary.com/ddk75efat/image/upload/v1623369994/bgah0gt6qibsuarqq64p.jpg';

    public static async createUser(payload: IUser): Promise<DocumentType<User>> {
        const user = new User(payload);
        await UserModelHooks.preCreation(user);
        return UserModel.create(user);
    }

    public static async addNotification(userId: string, payload: any): Promise<any> {
        const notification = {
            title: payload?.title,
            body: payload?.body,
            isRead: false,
            time: new Date(),
        };

        return UserModel.updateOne({_id: userId}, {
            $push: {
                notifications: {
                    $each: [notification],
                    $position: 0,
                },
            },
        });
    }

    public static async removeNotification(userId: string, index: number): Promise<any> {
        const update: any = {$set: {}};
        update['$set'][`notifications.${index}`] = null;

        return await UserModel.updateOne({_id: userId}, update) &&
            await UserModel.updateOne({_id: userId}, {$pull: {'notifications': null}});
    }

    public static isValidPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    public static async findByNationalId(nationalId: string, projection: string = ''): Promise<DocumentType<User>> {
        return UserModel.findOne({nationalId}, projection);
    }

    public static async patchOne(nationalId: string, payload: object): Promise<any> {
        const userObject = UserModelUtils.userObjectForUpdate(payload);
        const options: mongoose.QueryOptions = {runValidators: true};
        return UserModel.updateOne({nationalId}, {...userObject}, options);
    }

    public static async getAll(pageNumber: number): Promise<DocumentType<User>[]> {
        const sortStage: mongoose.PipelineStage = {$sort: {firstName: 1, lastName: 1}}; // stage 1 sort by created time
        const skipStage: mongoose.PipelineStage = {$skip: (pageNumber - 1) * this.USERS_LIMIT_PER_PAGE}; // stage 2 skip previous pages
        const limitStage: mongoose.PipelineStage = {$limit: this.USERS_LIMIT_PER_PAGE}; // stage 3 limitation users number
        const projectionStage: mongoose.PipelineStage = {$project: {password: 0, updatedAt: 0}}; // stage 4 remove password from the data

        return UserModel.aggregate([
            sortStage,
            skipStage,
            limitStage,
            projectionStage,
        ]);
    }

    public static async deleteOneUser(userId: string) {
        const roles = RoleService.deleteAllRoles(userId);
        const user = UserModel.findOneAndDelete({_id: userId});
        const conversations = ConversationService.deleteAll(userId);
        return Promise.all([user, roles, conversations]);
    }

    public static async login(payload: ILogin) {
        const user = await UserService.findByNationalId(payload.nationalId);
        return user && UserService.isValidPassword(payload.password, user?.password) && user;
    }

    public static async resetPassword(nationalId: string, security: ISecurity, newPassword: string): Promise<boolean> {
        const user = await UserModel.findOne({nationalId});
        const isCorrectAnswer = user && user.security.question === security.question &&
            bcrypt.compareSync(security.answer, user.security.answer);

        if (!isCorrectAnswer) {
            return false;
        }

        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(newPassword, salt); // hash password
        await UserModel.updateOne({nationalId}, {password});

        return true;
    }
}

export default UserService;
