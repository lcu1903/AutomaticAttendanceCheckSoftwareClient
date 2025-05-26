import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectScheduleStudentRes, SubjectScheduleStudentCreateReq } from './types';
import { Response } from '../../../core/response.types'; // Adjust path as needed

@Injectable({
    providedIn: 'root',
})
export class SubjectScheduleStudentService {
    private apiUrl = '/api/subject-schedule-students';

    constructor(private http: HttpClient) {}

    getAll(textSearch?: string): Observable<Response<SubjectScheduleStudentRes[]>> {
        return this.http.get<Response<SubjectScheduleStudentRes[]>>(this.apiUrl, {
            params: textSearch ? { textSearch } : {},
        });
    }

    getById(id: string): Observable<Response<SubjectScheduleStudentRes>> {
        return this.http.get<Response<SubjectScheduleStudentRes>>(`${this.apiUrl}/${id}`);
    }

    getByStudentId(studentId: string): Observable<Response<SubjectScheduleStudentRes[]>> {
        return this.http.get<Response<SubjectScheduleStudentRes[]>>(`${this.apiUrl}/by-student/${studentId}`);
    }

    create(req: SubjectScheduleStudentCreateReq[]): Observable<Response<SubjectScheduleStudentRes[]>> {
        return this.http.post<Response<SubjectScheduleStudentRes[]>>(this.apiUrl, req);
    }

    delete(id: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${id}`);
    }

    deleteRange(ids: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, { body: ids });
    }
}
