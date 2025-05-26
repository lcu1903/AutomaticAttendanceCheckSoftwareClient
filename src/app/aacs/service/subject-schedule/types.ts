import { StudentRes } from '../student/types';

export interface SubjectScheduleRes {
    subjectScheduleId: string;
    subjectScheduleCode: string;
    subjectId?: string;
    subjectCode?: string;
    subjectName?: string;
    semesterId: string;
    semesterName?: string;
    teacherId?: string;
    teacherCode?: string;
    teacherName?: string;
    classId?: string;
    classCode?: string;
    className?: string;
    teachingAssistant?: string;
    teachingAssistantCode?: string;
    teachingAssistantName?: string;
    roomNumber?: string;
    startDate?: string;
    endDate?: string;
    note?: string;
    students: StudentRes[];
    subjectScheduleDetails: SubjectScheduleDetailRes[];
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

export interface SubjectScheduleStudentRes {
    subjectScheduleStudentId: string;
    subjectScheduleId: string;
    studentId: string;
    // student?: StudentRes;
    // subjectSchedule?: SubjectScheduleRes;
}
