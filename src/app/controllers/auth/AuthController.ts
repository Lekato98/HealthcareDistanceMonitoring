import { Request, Response } from 'express';
import { IUser } from '../../models/user/UserModel';
import JWTUtils, { IJWTPayload } from '../../utils/JWTUtils';
import { HttpStatusCode } from '../../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';
import UserService from '../../models/user/UserService';
import AuthenticationUtils from '../../utils/AuthenticationUtils';
import { SUCCESS, UNSUCCESSFUL } from '../../helpers/constants';
import AdminModel from '../../models/admin/AdminModel';

export interface ILogin {
    nationalId: string;
    password: string;
}

@Injectable
class AuthController {
    /**
     * @Route /auth/registration
     * @POST
     * */
    public async registrationPage(req: Request, res: Response): Promise<void> {
        try {
            if (req.app.locals.jwt) {
                res.redirect('/');
            } else {
                res.render('registration');
            }
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).send('Server Error');
        }
    }

    /**
     * @Route /api/v1/auth/login
     * @POST
     * */
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const payload: ILogin = req.body;
            const user = await UserService.login(payload); // will return falsy value if login is invalid

            if (user) {
                const jwtPayload: IJWTPayload = {_id: user._id, nationalId: user.nationalId};
                AuthenticationUtils.setAuthCookies(res, jwtPayload);
                const body = {success: SUCCESS, user};
                res.json(body);
            } else {
                const body = {success: UNSUCCESSFUL, message: 'Invalid login'};
                res.status(HttpStatusCode.BAD_REQUEST).json(body);
            }

        } catch (e) {
            console.error(e);
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Desc creates user and token
     * @Route /api/v1/auth/register
     * @POST
     * */
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const userInfo: IUser = req.body;
            const user = await UserService.createUser(userInfo);

            // create and set token in cookie
            const jwtPayload: IJWTPayload = {_id: user._id, nationalId: user.nationalId}; // token payload
            AuthenticationUtils.setAuthCookies(res, jwtPayload);

            const body = {success: SUCCESS, user};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/admin-login
     * @POST
     * */
    public async adminLogin(req: Request, res: Response): Promise<void> {
        try {
            const {nationalId, password} = req.body;
            console.log(nationalId, password);
            const admin = await AdminModel.findOne({adminId: nationalId, password});

            if (admin) {
                const jwtPayload: IJWTPayload = {isAdmin: true, _id: admin._id};
                AuthenticationUtils.setAuthCookies(res, jwtPayload);
                const body = {success: SUCCESS, message: 'Welcome admin!'};
                res.json(body);
            } else {
                const body = {success: UNSUCCESSFUL, message: 'Invalid login'};
                res.status(HttpStatusCode.BAD_REQUEST).json(body);
            }
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }

    /**
     * @Route /api/v1/logout
     * @DELETE
     * */
    public logout(req: Request, res: Response): void {
        try {
            res.clearCookie(JWTUtils.JWT_COOKIE_NAME);
            const body = {success: SUCCESS};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL, message: e.message};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default AuthController;
