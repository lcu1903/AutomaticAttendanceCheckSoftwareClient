export interface SubjectScheduleStudentRes {
    subjectScheduleStudentId: string;
    subjectScheduleId: string;
    subjectScheduleDetailId?: string;
    studentId?: string;
    subjectScheduleCode: string;
    subjectId: string;
    subjectCode?: string;
    subjectName?: string;
    startTime?: string;
    endTime?: string;
    teacherName?: string;
    classRoom?: string;
    isCheckable?: boolean;
}

export interface SubjectScheduleStudentCreateReq {
    subjectScheduleId: string;
    studentId: string;
}
