import { DocumentType } from '@typegoose/typegoose';
import UserModelUtils from './UserModelUtils';
import UserModel, { IUser, User } from './UserModel';
import RoleService from '../roles/RoleService';
import UserModelHooks from './UserModelHooks';
import { ILogin } from '../../controllers/auth/AuthController';
import { QueryUpdateOptions } from 'mongoose';

const bcrypt = require('bcrypt');

class UserService {
    public static readonly USERS_LIMIT_PER_PAGE: number = 20; // used for get all users

    public static async createUser(payload: IUser): Promise<DocumentType<User>> {
        const user = new User(payload);
        await UserModelHooks.preCreation(user);
        return UserModel.create(user);
    }

    public static isValidPassword(password: string, hashedPassword: string): boolean {
        return bcrypt.compareSync(password, hashedPassword);
    }

    public static async findByNationalId(nationalId: string, projection: string = ''): Promise<DocumentType<User>> {
        return UserModel.findOne({nationalId}, projection);
    }

    public static async patchOne(nationalId: string, payload: object): Promise<any> {
        const userObject = UserModelUtils.userObjectForUpdate(payload);
        const options: QueryUpdateOptions = {runValidators: true};
        return UserModel.updateOne({nationalId}, {...userObject}, options);
    }

    public static async getAll(pageNumber: number): Promise<DocumentType<User>[]> {
        const sortStage = {$sort: {createdAt: 1}}; // stage 1 sort by created time
        const skipStage = {$skip: (pageNumber - 1) * this.USERS_LIMIT_PER_PAGE}; // stage 2 skip previous pages
        const limitStage = {$limit: this.USERS_LIMIT_PER_PAGE}; // stage 3 limitation users number
        const projectionStage = {$project: {password: 0, updatedAt: 0}}; // stage 4 remove password from the data

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
        return Promise.all([user, roles]);
    }

    public static async login(payload: ILogin) {
        const user = await UserService.findByNationalId(payload.nationalId);
        return UserService.isValidPassword(payload.password, user?.password) && user;
    }
}

export default UserService;
