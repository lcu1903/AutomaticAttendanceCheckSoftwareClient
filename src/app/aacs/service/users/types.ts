export interface UserRes {
    userId: string;
    userName: string;
    email: string;
    phoneNumber?: string;
    fullName?: string;
    positionId?: string;
    positionName?: string;
    departmentId?: string;
    departmentName?: string;
    birthdate?: Date;
}

export interface UserCreateReq {
    userName: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    departmentId?: string;
    positionId?: string;
    birthdate?: Date;
}
export interface UserUpdateReq {
    userId: string;
    userName: string;
    email: string;
    phoneNumber: string;
    fullName?: string;
    departmentId?: string;
    positionId?: string;
    birthdate?: Date;
}
