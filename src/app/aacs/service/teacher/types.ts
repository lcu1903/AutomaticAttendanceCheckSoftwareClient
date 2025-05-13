import { UserRes } from '../users/types';

export interface TeacherRes {
    teacherId: string;
    teacherCode: string;
    userId?: string;
    user?: UserRes;
}
export interface TeacherCreateReq {
    teacherCode: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    departmentId?: string;
    positionId?: string;
    imageUrl?: string;
    birthdate?: string;
}
export interface TeacherUpdateReq {
    teacherId: string;
    teacherCode: string;
    userId: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    departmentId?: string;
    positionId?: string;
    imageUrl?: string;
    birthdate?: string;
}
