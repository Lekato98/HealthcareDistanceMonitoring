import { Request, Response } from 'express';
import { IUser } from '../../models/user/UserModel';
import JWTUtils, { IJWTPayload } from '../../utils/JWTUtils';
import { HttpStatusCode } from '../../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';
import UserService from '../../models/user/UserService';
import AuthenticationUtils from '../../utils/AuthenticationUtils';
import { SUCCESS, UNSUCCESSFUL } from '../../helpers/constants';

export interface ILogin {
    nationalId: string;
    password: string;
}

@Injectable
class AuthController {
    /**
     * @route /auth/registration
     * */
    public async registrationPage(req: Request, res: Response): Promise<void> {
        res.render('registration');
    }

    /**
     * @route /api/v1/auth/login
     * @body ILogin
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
     * @description creates user and token
     * @body IUser
     * @route /api/v1/auth/register
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
     * @route /api/v1/logout
     * @request DELETE
     * */
    public logout(req: Request, res: Response): void {
        try {
            res.clearCookie(JWTUtils.JWT_COOKIE_NAME);
            const body = {success: SUCCESS};
            res.json(body);
        } catch (e) {
            const body = {success: UNSUCCESSFUL};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default AuthController;
