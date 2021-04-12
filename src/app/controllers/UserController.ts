import { Request, Response } from 'express';
import UserModel from '../models/user/UserModel';
import { HttpStatusCode } from '../utils/HttpUtils';

class UserController {
    /**
     * @route /user/profile
     * @request GET
     * */
    public static async userProfilePage(req: Request, res: Response): Promise<void> {
        res.render('profile');
    }

    /**
     * @route /api/v1/user/:nationalId
     * */
    public static async getUser(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = req.params;
            const projection = '-password';
            const user = await UserModel.findByNationalId(nationalId, projection);

            if (user) {
                const body = {success: 1, user};
                res.json(body);
            } else {
                const body = {success: 0, message: 'User not found'};
                res.status(HttpStatusCode.NOT_FOUND).json(body);
            }

        } catch (e) {
            const body = {success: 0, message: e.message};
            res.json(body);
        }
    }

    /**
     * @route /api/v1/user
     * @request PATCH
     * */
    public static async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = res.locals.jwt;
            const payload = req.body;
            const user = await UserModel.patchOne(nationalId, payload);
            const body = {success: 1, user};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @route /api/v1/user/users?page=
     * @request GET
     * */
    public static async getUsersByPageNumber(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber = Number(req.query.page) || 1; // 1 for default
            const users = await UserModel.getAll(pageNumber);
            const body = {success: 1, users};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @route /api/v1/user
     * @request DELETE
     * */
    public static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = res.locals.jwt.nationalId;
            const user = UserModel.deleteOneUser(nationalId);
            const body = {success: 1, user};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default UserController;
