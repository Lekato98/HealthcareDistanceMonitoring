import { CookieOptions } from 'express';
import mongoose from 'mongoose';

const jwt = require('jsonwebtoken');

export interface IJWTPayload {
    _id: mongoose.Types.ObjectId,
    nationalId: string,
    role: string,
}

export interface IJWTOptions {
    expiresIn: number | string | Date;
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
