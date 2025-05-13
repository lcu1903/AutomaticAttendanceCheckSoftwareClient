import { UserRes } from '../users/types';

export interface ClassRes {
    classId: string;
    classCode: string;
    className: string;
    schoolYearStart?: string;
    schoolYearEnd?: string;
    departmentId?: string;
    departmentName?: string;
    headTeacherId?: string;
    headTeacherName?: string;
    room?: string;
    students: UserRes[];
}
export interface ClassCreateReq {
    classCode: string;
    className: string;
    schoolYearStart?: string;
    schoolYearEnd?: string;
    departmentId?: string;
    headTeacherId?: string;
    room?: string;
}
export interface ClassUpdateReq {
    classId: string;
    classCode: string;
    className: string;
    schoolYearStart?: string;
    schoolYearEnd?: string;
    departmentId?: string;
    headTeacherId?: string;
    room?: string;
}
