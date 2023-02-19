import { Request, Response } from 'express';
import { HttpStatusCode } from '../../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';
import UserService from '../../models/user/UserService';
import { SUCCESS, UNSUCCESSFUL } from '../../helpers/constants';
import CloudinaryService from '../../services/CloudinaryService';

@Injectable
class UserController {
    /**
     * @Route /profile/:nationalId
     * @GET
     * */
    public async profilePage(req: Request, res: Response): Promise<void> {
        try {
            const nationalId = (req.params.nationalId === 'me' ?
                    req.app.locals.jwt.nationalId :
                    req.params.nationalId
            );
            const projection = '-password';
            const user = await UserService.findByNationalId(nationalId, projection);
            if (!user) {
                res.redirect('/404');
            }  else {
                res.render('profile', {user});
            }
        } catch (e: any) {
            res.status(HttpStatusCode.SERVER_ERROR).send('Server Error');
        }
    }

    /**
     * @Route /profile/edit
     * @GET
     * */
    public async editProfilePage(req: Request, res: Response): Promise<void> {
        try {
            res.render('editProfile.ejs');
        } catch (e: any) {
            res.status(HttpStatusCode.SERVER_ERROR).send('Server Error');
        }
    }

    /**
     * @Route /api/v1/user/:nationalId
     * @GET
     * */
    public async getUser(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = req.params;
            const projection = '-password';
            const user = await UserService.findByNationalId(nationalId, projection);

            if (user) {
                const body = {success: SUCCESS, user};
                res.json(body);
            } else {
                const body = {success: UNSUCCESSFUL, message: 'User not found'};
                res.status(HttpStatusCode.NOT_FOUND).json(body);
            }

        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.json(body);
        }
    }

    /**
     * @Route /api/v1/user
     * @PATCH
     * */
    public async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId} = req.app.locals.jwt;
            const payload = req.body;
            const user = await UserService.patchOne(nationalId, payload);
            const body = {success: SUCCESS, user};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/user/users?page=
     * @GET
     * */
    public async getUsersByPageNumber(req: Request, res: Response): Promise<void> {
        try {
            const pageNumber = Number(req.query.page) || 1; // 1 for default
            const users = await UserService.getAll(pageNumber);
            const body = {success: SUCCESS, users};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/user
     * @DELETE
     * */
    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const {_id} = req.app.locals.jwt;
            const user = await UserService.deleteOneUser(_id);
            const body = {success: SUCCESS, user};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/user/add-notification
     * @POST
     * */
    public async addNotification(req: Request, res: Response): Promise<void> {
        try {
            const {userId, ...payload} = req.body;
            const notification = await UserService.addNotification(userId, payload);
            const body = {success: SUCCESS, notification};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/user/remove-notification
     * @POST
     * */
    public async removeNotification(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.app.locals.jwt._id;
            const {index}: any = req.params;
            const notification = await UserService.removeNotification(userId, index);
            const body = {success: SUCCESS, notification};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/user/change-photo
     * @POST
     * */
    public async changePhoto(req: Request, res: Response): Promise<void> {
        try {
            const nationalId = req.app.locals.jwt.nationalId;
            // @ts-ignore
            const imageInfo = await CloudinaryService.uploadSingleImage(req.file.path);
            await UserService.patchOne(nationalId, {avatar: imageInfo.secure_url});
            const body = {success: SUCCESS, imageInfo};
            res.json(body);
        } catch (e: any) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default UserController;
