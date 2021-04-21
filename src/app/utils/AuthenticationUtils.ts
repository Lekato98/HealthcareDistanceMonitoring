import JWTUtils, { IJWTPayload } from './JWTUtils';
import { Response } from 'express';

class AuthenticationUtils {
    public static readonly IS_LOGGED_IN = 'isLoggedIn';
    public static readonly LOGGED_IN = true;

    public static setAuthCookies(res: Response, jwtPayload?: IJWTPayload): void {
        const token = JWTUtils.createToken(jwtPayload); // create JWT token

        res.cookie(JWTUtils.JWT_COOKIE_NAME, token, JWTUtils.JWT_COOKIE_OPTIONS); // set token in cookies
        res.cookie(this.IS_LOGGED_IN, this.LOGGED_IN);
    }

    public static removeAuthCookies(res: Response): void {
        res.clearCookie(JWTUtils.JWT_COOKIE_NAME);
        res.clearCookie(this.IS_LOGGED_IN);
    }
}

export default AuthenticationUtils;
