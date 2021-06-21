import {NextFunction, Request, Response} from 'express';
import JWTUtils from '../utils/JWTUtils';
import {HttpStatusCode} from '../utils/HttpUtils';
import {Injectable} from 'dependency-injection-v1';
import UserService from '../models/user/UserService';
import AuthenticationUtils from '../utils/AuthenticationUtils';
import {UNSUCCESSFUL} from '../helpers/constants';
import AdminModel from '../models/admin/AdminModel';
import ConversationService from "../models/conversation/ConversationService";
import {RoleName} from "../models/user/UserModel";

const jwt = require('jsonwebtoken');

@Injectable
class AuthMiddleware {
    // global middleware
    public async setAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            res.locals.isAdmin = false;
            res.locals.me = undefined;
            res.locals.role = RoleName.NO_ROLE;

            const token = req.cookies[JWTUtils.JWT_COOKIE_NAME];
            const decodedToken = await jwt.verify(token, JWTUtils.JWT_SECRET);
            const projection = '-password';
            const user = await UserService.findByNationalId(decodedToken.nationalId, projection);

            if (user && user._id === decodedToken._id) {
                const conversations = await ConversationService.getAllByUserId(user._id);
                req.app.locals.jwt = {...decodedToken, user};
                res.locals.me = user;
                res.locals.me.conversations = conversations.filter(conversation => conversation.messages.length);
            } else {
                const admin = await AdminModel.findOne({_id: decodedToken._id});

                if (admin) {
                    req.app.locals.jwt = {...decodedToken, admin, isAdmin: true};
                    res.locals.isAdmin = true;
                } else {
                    AuthenticationUtils.removeAuthCookies(res);
                    delete req.app.locals.jwt;
                }
            }
        } catch (e) {
            AuthenticationUtils.removeAuthCookies(res);
            delete req.app.locals.jwt;
        } finally {
            next();
        }
    }

    public isAuth(req: Request, res: Response, next: NextFunction): void {
        // setAuth is a global middleware which sets the exist decoded token in req.app.locals.jwt
        // so we have to check only if the jwt is exist
        if (req.app.locals.jwt) {
            next();
        } else {
            const body = {success: UNSUCCESSFUL, message: 'Unauthorized'};
            res.status(HttpStatusCode.UNAUTHORIZED).json(body);
        }
    }

    public setRequestAppLocals(req: Request, res: Response, next: NextFunction): void {
        req.app.locals = {};
        next();
    }
}

export default AuthMiddleware;
