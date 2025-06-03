export interface AttendanceRes {
    attendanceId: string;
    attendanceTime: string;
    userId?: string;
    subjectScheduleId?: string;
    statusId?: string;
    note?: string;
    imageUrl?: string;
    subjectCode?: string;
    subjectName?: string;
    teacherCode?: string;
    teacherName?: string;
    roomNumber?: string;
}
export interface AttendanceCreateReq {
    attendanceTime: string;
    userId?: string;
    subjectScheduleId?: string;
    statusId?: string;
    note?: string;
    imageUrl?: string;
}
export interface AttendanceUpdateReq {
    attendanceId: string;
    attendanceTime: string;
    userId?: string;
    subjectScheduleId?: string;
    statusId?: string;
    note?: string;
    imageUrl?: string;
}

export interface AttendanceHistoryStudentRes {
    subjectCode?: string;
    subjectName?: string;
    teacherCode?: string;
    teacherName?: string;
    roomNumber?: string;
    userId?: string;
    startDate?: string;
    endDate?: string;
    attendanceDetails: AttendanceHistoryStudentDetailRes[];
}
export interface AttendanceHistoryStudentDetailRes {
    attendanceId?: string;
    attendanceTime?: string;
    subjectScheduleDetailId?: string;
    scheduleDate?: string;
    startTime?: string;
    endTime?: string;
    statusId?: string;
    note?: string;
    imageUrl?: string;
}
