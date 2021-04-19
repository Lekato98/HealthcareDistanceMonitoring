import { CookieOptions } from 'express';

const jwt = require('jsonwebtoken');

export interface IJWTPayload {
    _id: string,
    nationalId: string,
    current_role?: string,
    roleId?: string,
}

export interface IJWTOptions {
    expiresIn: number | string | Date;
}

abstract class JWTUtils {
    public static readonly JWT_COOKIE_NAME = 'jwt';
    public static readonly JWT_OPTIONS: IJWTOptions = {expiresIn: '1h'};
    public static readonly JWT_COOKIE_OPTIONS: CookieOptions = {
        maxAge: 60 * 60 * 60 * 1000,
        httpOnly: true,
    };

    public static createToken(payload: IJWTPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET, this.JWT_OPTIONS);
    }
}

export default JWTUtils;
