export interface SubjectRes {
    subjectId: string;
    subjectCode: string;
    subjectName?: string;
    subjectCredits: number;
}
export interface SubjectCreateReq {
    subjectCode: string;
    subjectName?: string;
    subjectCredits: number;
}
export interface SubjectUpdateReq {
    subjectId: string;
    subjectCode: string;
    subjectName?: string;
    subjectCredits: number;
}
