import { Request, Response } from 'express';
import UserModel, { IUser, User } from '../models/UserModel';
import JWTUtils, { IJWTPayload } from '../utils/JWTUtils';
import { DocumentType } from '@typegoose/typegoose';

abstract class AuthController {
    public static async login(req: Request, res: Response): Promise<void> {
        res.json({success: 1});
    }

    /**
     * @function register post api
     * @desc creates user and token
     * */
    public static async register(req: Request<any, IUser>, res: Response): Promise<void> {
        try {
            const userInfo: IUser = req.body; // should implements IUser
            const user: DocumentType<User> = await UserModel.create(userInfo);
            const payload: IJWTPayload = {
                nationalId: user.nationalId,
            }; // token payload

            const token = JWTUtils.createToken(payload); // create JWT token
            res.cookie(JWTUtils.JWT_COOKIE_NAME, token, JWTUtils.JWT_COOKIE_OPTIONS); // set token in cookies

            const body = {
                success: 1,
                token,
                user,
            };
            res.json(body);
        } catch (e) {
            res.status(500).json({success: 0, message: e.message});
        }

    }
}

export default AuthController;
