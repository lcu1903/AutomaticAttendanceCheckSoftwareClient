export interface UserRes {
    userId: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    fullName?: string;
}

export interface UserCreateReq {
    userName: string;
    password: string;
    email: string;
    phoneNumber: string;
    fullName?: string;
}
export interface UserUpdateReq {
    userId: string;
    userName: string;
    email: string;
    phoneNumber: string;
    fullName?: string;
}