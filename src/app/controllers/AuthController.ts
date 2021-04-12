import { Request, Response } from 'express';
import UserModel, { IUser, RoleName, User } from '../models/user/UserModel';
import JWTUtils, { IJWTPayload } from '../utils/JWTUtils';
import { DocumentType } from '@typegoose/typegoose';
import { HttpStatusCode } from '../utils/HttpUtils';
import { UserModelFactory } from '../models/user/UserModelFactory';

export interface ILogin {
    nationalId: string;
    password: string;
}

class AuthController {
    public readonly LOGIN_PAGE = 'login';
    public readonly REGISTER_PAGE = 'register';

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
        res.render(this.REGISTER_PAGE);
    }

    /**
     * @route /api/v1/auth/login
     * @body ILogin
     * */
    public async login(req: Request, res: Response): Promise<void> {
        try {
            const loginInformation: ILogin = req.body;
            const user: DocumentType<User> = await UserModel.findByNationalId(loginInformation.nationalId);

            if (user) {
                if (UserModel.isValidPassword(loginInformation.password, user.password)) {
                    const payload: IJWTPayload = {_id: user._id, nationalId: user.nationalId, role: user.role};
                    const token = JWTUtils.createToken(payload);
                    res.cookie(JWTUtils.JWT_COOKIE_NAME, token, JWTUtils.JWT_COOKIE_OPTIONS); // set token in cookies
                    const body = {success: 1, token};
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
            res.status(HttpStatusCode.SERVER_ERROR).json({success: 0, message: e.message});
        }
    }

    /**
     * @desc creates user and token
     * @body IUser
     * @route /api/v1/auth/register
     * */
    public async register(req: Request, res: Response): Promise<void> {
        try {
            const userInfo: IUser = req.body;
            const user = await UserModelFactory.create(userInfo).save();

            // create and set token in cookie
            const payload: IJWTPayload = {_id: user._id, nationalId: user.nationalId, role: user.role}; // token payload
            const token = JWTUtils.createToken(payload); // create JWT token
            res.cookie(JWTUtils.JWT_COOKIE_NAME, token, JWTUtils.JWT_COOKIE_OPTIONS); // set token in cookies

            const body = {success: 1, token};
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

const authController = new AuthController();

export {
    authController,
};
export default authController;
