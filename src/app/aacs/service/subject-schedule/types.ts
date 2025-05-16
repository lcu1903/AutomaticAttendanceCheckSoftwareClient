import { ClassRes } from '../class/types';
import { SemesterRes } from '../semester/types';
import { SubjectRes } from '../subject/types';
import { TeacherRes } from '../teacher/types';

export interface SubjectScheduleRes {
    subjectScheduleId: string;
    subjectScheduleCode: string;
    subjectId?: string;
    semesterId: string;
    teacherId?: string;
    teachingAssistant?: string;
    roomNumber?: string;
    startDate?: string;
    endDate?: string;
    note?: string;
    classId?: string;
    class?: ClassRes;
    semester: SemesterRes;
    subject?: SubjectRes;
    teacher?: TeacherRes;
    teachingAssistantNavigation?: TeacherRes;
    subjectScheduleDetails?: SubjectScheduleDetailRes[];
}
export interface SubjectScheduleCreateReq {
    subjectScheduleCode: string;
    subjectId?: string;
    semesterId: string;
    teacherId?: string;
    teachingAssistant?: string;
    roomNumber?: string;
    startDate?: string;
    endDate?: string;
    note?: string;
    classId?: string;
}
export interface SubjectScheduleUpdateReq {
    subjectScheduleId: string;
    subjectScheduleCode: string;
    subjectId?: string;
    semesterId: string;
    teacherId?: string;
    teachingAssistant?: string;
    roomNumber?: string;
    startDate?: string;
    endDate?: string;
    note?: string;
    classId?: string;
}
export interface SubjectScheduleDetailRes {
    subjectScheduleDetailId: string;
    subjectScheduleId?: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    note?: string;
}
export interface SubjectScheduleDetailCreateReq {
    subjectScheduleId?: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    note?: string;
}
export interface SubjectScheduleDetailUpdateReq {
    subjectScheduleDetailId: string;
    subjectScheduleId?: string;
    scheduleDate: string;
    startTime: string;
    endTime: string;
    note?: string;
}
export interface SubjectScheduleDetailChangeScheduleReq {
    subjectScheduleId: string;
    startTime: string;
    endTime: string;
    listScheduleDate: string[];
}
