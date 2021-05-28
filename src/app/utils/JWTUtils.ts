import { CookieOptions } from 'express';
import { RoleName, roleType } from '../models/user/UserModel';

const jwt = require('jsonwebtoken');

export interface IJWTPayload {
    _id: string;
    nationalId: string;
    roleId?: string;
    roleName?: roleType;
}

export interface IJWTOptions {
    expiresIn: number | string | Date;
}

export class JWTPayload implements IJWTPayload {
    _id: string;
    nationalId: string;
    roleId?: string;
    roleName?: roleType;

    constructor(payload: IJWTPayload) {
        this._id = payload._id;
        this.nationalId = payload.nationalId;
        this.roleId = payload.roleId || '';
        this.roleName = payload.roleName || RoleName.NO_ROLE;
    }
}

abstract class JWTUtils {
    public static readonly JWT_SECRET = process.env.JWT_SECRET;
    public static readonly JWT_COOKIE_NAME = 'jwt';
    public static readonly JWT_OPTIONS: IJWTOptions = {expiresIn: '1h'};
    public static readonly JWT_COOKIE_OPTIONS: CookieOptions = {
        maxAge: 60 * 60 * 60 * 1000,
        httpOnly: true,
    };

    public static createToken(payload: IJWTPayload): string {
        const jwtPayload = {...new JWTPayload(payload)};
        return jwt.sign(jwtPayload, JWTUtils.JWT_SECRET, JWTUtils.JWT_OPTIONS);
    }
}

export default JWTUtils;
