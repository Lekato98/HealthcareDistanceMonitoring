import JWTUtils, { IJWTPayload } from './JWTUtils';
import { CookieOptions, Response } from 'express';
import { RoleName } from '../models/user/UserModel';

class AuthenticationUtils {
    public static readonly IS_LOGGED_IN = 'isLoggedIn';
    public static readonly IS_ADMIN = 'isAdmin';
    public static readonly LOGGED_IN = true;
    public static readonly ROLE_NAME = 'roleName';
    public static readonly DEFAULT_COOKIE_OPTIONS: CookieOptions = {
        maxAge: 60 * 60 * 60 * 1000,
    };

    public static setAuthCookies(res: Response, jwtPayload?: IJWTPayload): void {
        const token = JWTUtils.createToken(jwtPayload); // create JWT token
        const roleName = jwtPayload.roleName || RoleName.NO_ROLE;
        const isAdmin: boolean = jwtPayload.isAdmin || false;

        res.cookie(JWTUtils.JWT_COOKIE_NAME, token, JWTUtils.JWT_COOKIE_OPTIONS); // set token in cookies
        res.cookie(this.IS_LOGGED_IN, this.LOGGED_IN, this.DEFAULT_COOKIE_OPTIONS);
        res.cookie(this.ROLE_NAME, roleName, this.DEFAULT_COOKIE_OPTIONS);
        res.cookie(this.IS_ADMIN, isAdmin, this.DEFAULT_COOKIE_OPTIONS);
    }

    public static removeAuthCookies(res: Response): void {
        res.clearCookie(JWTUtils.JWT_COOKIE_NAME);
        res.clearCookie(this.IS_LOGGED_IN);
    }
}

export default AuthenticationUtils;
