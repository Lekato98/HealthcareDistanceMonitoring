import { Request, Response } from 'express';
import UserModel, { IUser, User } from '../models/UserModel';
import JWTUtils, { IJWTPayload } from '../utils/JWTUtils';
import { DocumentType } from '@typegoose/typegoose';
import { HttpStatusCode } from '../utils/HttpUtils';
import { UserModelFactory } from '../models/UserModelFactory';

export interface ILogin {
    nationalId: string;
    password: string;
}

class AuthController {
    public readonly LOGIN_PAGE = 'login';
    public readonly REGISTER_PAGE = 'register';

    public loginPage(req: Request, res: Response): void {
        res.render(this.LOGIN_PAGE);
    }

    public async registerPage(req: Request, res: Response): Promise<void> {
        res.render(this.REGISTER_PAGE);
    }

    public async login(req: Request<any, any, ILogin>, res: Response): Promise<void> {
        try {
            const loginInformation: ILogin = req.body; // should implements ILogin
            const user: DocumentType<User> = await UserModel.findByNationalId(loginInformation.nationalId);
            if (UserModel.isValidPassword(loginInformation.password, user.password)) {
                const payload: IJWTPayload = {_id: user._id, nationalId: user.nationalId};
                const token = JWTUtils.createToken(payload);
                res.json({success: 1, token});
            } else {
                res.status(HttpStatusCode.BAD_REQUEST).json({success: 0, message: 'Invalid password'});
            }
        } catch (e) {
            res.status(HttpStatusCode.SERVER_ERROR).json({success: 0, message: e.message});
        }
    }

    /**
     * @function register post api
     * @desc creates user and token
     * @body IUser
     * */
    public async register(req: Request<any, any, IUser>, res: Response): Promise<void> {
        try {
            const userInfo: IUser = req.body; // should implements IUser
            const user: DocumentType<User> = await UserModelFactory.create('patient', userInfo).save();
            const payload: IJWTPayload = {
                _id: user._id,
                nationalId: user.nationalId,
            }; // token payload

            const token = JWTUtils.createToken(payload); // create JWT token
            res.cookie(JWTUtils.JWT_COOKIE_NAME, token, JWTUtils.JWT_COOKIE_OPTIONS); // set token in cookies
            const body = {
                success: 1,
                token,
            };
            res.json(body);
        } catch (e) {
            const body = {
                success: 0,
                message: e.message,
            };
            res.status(HttpStatusCode.SERVER_ERROR).json(body);
        }

    }
}

const authController = new AuthController();

export default authController;
