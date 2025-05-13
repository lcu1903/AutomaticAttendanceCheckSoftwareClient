import { ClassRes } from '../class/types';
import { UserRes } from '../users/types';

export interface StudentRes {
    studentId: string;
    studentCode: string;
    classId: string;
    userId?: string;
    user?: UserRes;
    class: ClassRes;
}
export interface StudentCreateReq {
    studentCode: string;
    classId?: string;
    userName: string;
    email?: string;
    phoneNumber?: string;
    fullName?: string;
    departmentId?: string;
    positionId?: string;
    imageUrl?: string;
    birthdate?: string;
}
export interface StudentUpdateReq {
    studentId: string;
    studentCode: string;
    classId?: string;
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
