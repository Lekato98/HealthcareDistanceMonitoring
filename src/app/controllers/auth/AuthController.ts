import { Request, Response } from 'express';
import { IUser, User } from '../../models/user/UserModel';
import JWTUtils, { IJWTPayload } from '../../utils/JWTUtils';
import { DocumentType } from '@typegoose/typegoose';
import { HttpStatusCode } from '../../utils/HttpUtils';
import { Injectable } from 'dependency-injection-v1';
import UserService from '../../models/user/UserService';
import AuthenticationUtils from '../../utils/AuthenticationUtils';

export interface ILogin {
    nationalId: string;
    password: string;
}

@Injectable
class AuthController {
    public readonly LOGIN_PAGE = 'login';

    /**
     * @route /auth/login
     * */
    public loginPage(req: Request, res: Response): void {
        res.render(this.LOGIN_PAGE);
    }

    /**
     * @route /auth/register
     * */
    public async registerPage(req: Request, res: Response): Promise<void> {
        res.render('registration');
    }

    /**
     * @route /api/v1/auth/login
     * @body ILogin
     * */
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const loginInformation: ILogin = req.body;
            const user: DocumentType<User> = await UserService.findByNationalId(loginInformation.nationalId);

            if (user) {
                if (UserService.isValidPassword(loginInformation.password, user.password)) {
                    const jwtPayload: IJWTPayload = {_id: user._id, nationalId: user.nationalId};
                    AuthenticationUtils.setAuthCookies(res, jwtPayload);

                    const body = {success: 1, user};
                    res.json(body);
                } else {
                    const body = {success: 0, message: 'Invalid password'};
                    res.status(HttpStatusCode.BAD_REQUEST).json(body);
                }
            } else {
                const body = {success: 0, message: 'Invalid national id'};
                res.status(HttpStatusCode.BAD_REQUEST).json(body);
            }

        } catch (e) {
            console.error(e);
            const body = {success: 0, message: e.message};
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
            console.log('test')
            const userInfo: IUser = req.body;
            const user = await UserService.createUser(userInfo);

            // create and set token in cookie
            const jwtPayload: IJWTPayload = {_id: user._id, nationalId: user.nationalId}; // token payload
            AuthenticationUtils.setAuthCookies(res, jwtPayload);

            const body = {success: 1, user};
            res.json(body);
        } catch (e) {
            const body = {success: 0, message: e.message};
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
            const body = {success: 1};
            res.json(body);
        } catch (e) {
            const body = {success: 0};
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }
    }
}

export default AuthController;
