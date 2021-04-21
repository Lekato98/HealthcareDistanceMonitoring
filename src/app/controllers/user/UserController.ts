import { Request, Response } from 'express';
import { HttpStatusCode } from '../../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';
import UserService from '../../models/user/UserService';

@Injectable
class UserController {
    /**
     * @route /profile/:nationalId
     * @request GET
     * */
    public async userProfilePage(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = req.params;
            const user = await UserService.findByNationalId(nationalId);
            res.render('profile', {user});
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).send('Server Error');
        }
    }

    public async registrationPage(req: Request, res: Response): Promise<void> {
        try {
            if (res.locals.jwt) {
                res.redirect('/');
            } else {
                res.render('registration');
            }
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).send('Server Error');
        }
    }

    /**
     * @route /api/v1/user/:nationalId
     * */
    public async getUser(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = req.params;
            const projection = '-password';
            const user = await UserService.findByNationalId(nationalId, projection);

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
    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = res.locals.jwt;
            const payload = req.body;
            const user = await UserService.patchOne(nationalId, payload);
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
    public async getUsersByPageNumber(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber = Number(req.query.page) || 1; // 1 for default
            const users = await UserService.getAll(pageNumber);
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
    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const {_id} = res.locals.jwt;
            const user = await UserService.deleteOneUser(_id);
            const body = {success: 1, user};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default UserController;
