import { UserRes } from '../users/types';

export interface LoginRes {
    token?: TokenRes;
    user?: UserRes;
}

export interface TokenRes {
    accessToken?: string;
    refreshToken?: string;
    expiration: string;
}
export interface RefreshTokenReq {
    refreshToken?: string;
}
export interface RegisterReq {
    userName: string;
    password: string;
    email: string;
    phoneNumber?: string | null;
    fullName?: string | null;
}
export interface LoginReq {
    userName: string;
    password: string;
}
export interface ChangePasswordReq {
    userId: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
