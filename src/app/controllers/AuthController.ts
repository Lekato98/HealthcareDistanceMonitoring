import { Request, Response } from 'express';
import UserModel from '../models/UserModel';

abstract class AuthController {
    public static async login(req: Request, res: Response): Promise<void> {
        res.json({success: 1});
    }

    public static async register(req: Request, res: Response): Promise<void> {
        const {
            firstName,
            lastName,
            gender,
            birthdate,
            homeAddress,
            phoneNumber,
            password,
        } = req.body;

        const user = new UserModel.Model({
            firstName,
            lastName,
            gender,
            birthdate,
            homeAddress,
            phoneNumber,
            password,
        });

        try {
            await user.save();
            res.json({success: 1, user});
        } catch (e) {
            res.json({success: 0, message: e.message});
        }

    }
}

export default AuthController;
