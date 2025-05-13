export interface SemesterRes {
    semesterId: string;
    semesterName: string;
    startDate?: string;
    endDate?: string;
}
export interface SemesterCreateReq {
    semesterName: string;
    startDate?: string;
    endDate?: string;
}
export interface SemesterUpdateReq {
    semesterId: string;
    semesterName: string;
    startDate?: string;
    endDate?: string;
}
