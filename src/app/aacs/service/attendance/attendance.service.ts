import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../../../core/response.types'; // Điều chỉnh path nếu cần
import { AttendanceRes, AttendanceCreateReq, AttendanceUpdateReq, AttendanceHistoryStudentRes } from './types'; // Điều chỉnh path nếu cần

@Injectable({
    providedIn: 'root',
})
export class AttendanceService {
    private apiUrl = '/api/attendances';

    constructor(private http: HttpClient) {}

    getAll(filters?: {
        textSearch?: string;
        subjectIds?: string[];
        fromDate?: string;
        toDate?: string;
        pageIndex?: number;
        pageSize?: number;
        userId?: string;
    }): Observable<Response<AttendanceRes[]>> {
        return this.http.get<Response<AttendanceRes[]>>(this.apiUrl, { params: filters });
    }

    getById(attendanceId: string): Observable<Response<AttendanceRes>> {
        return this.http.get<Response<AttendanceRes>>(`${this.apiUrl}/${attendanceId}`);
    }

    create(req: AttendanceCreateReq): Observable<Response<AttendanceRes>> {
        return this.http.post<Response<AttendanceRes>>(this.apiUrl, req);
    }

    update(attendanceId: string, req: AttendanceUpdateReq): Observable<Response<AttendanceRes>> {
        return this.http.put<Response<AttendanceRes>>(`${this.apiUrl}/${attendanceId}`, req);
    }

    delete(attendanceId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${attendanceId}`);
    }

    deleteRange(ids: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, { body: ids });
    }
    getAttendanceHistoriesByUserId(filter?: {
        userId?: string;
        subjectId?: string;
        semesterId?: string;
    }): Observable<Response<AttendanceHistoryStudentRes[]>> {
        return this.http.get<Response<AttendanceHistoryStudentRes[]>>(`${this.apiUrl}/${filter?.userId}/histories`, { params: filter });
    }
}
