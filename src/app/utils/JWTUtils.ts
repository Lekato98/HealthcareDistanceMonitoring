import { CookieOptions } from 'express';

const jwt = require('jsonwebtoken');

export interface IJWTPayload {
    nationalId: string,
}

export interface IJWTOptions {
    expiresIn: number | string;
}

abstract class JWTUtils {
    public static readonly JWT_COOKIE_NAME = 'jwt';
    public static readonly JWT_OPTIONS: IJWTOptions = {
        expiresIn: '1h',
    };
    public static readonly JWT_COOKIE_OPTIONS: CookieOptions = {
        maxAge: 60 * 60 * 60,
        httpOnly: true,
    };

    public static createToken(payload: IJWTPayload): string {
        return jwt.sign(payload, process.env.JWT_SECRET, this.JWT_OPTIONS);
    }
}

export default JWTUtils;
