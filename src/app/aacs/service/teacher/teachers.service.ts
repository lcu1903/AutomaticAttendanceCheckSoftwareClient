import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../../../core/response.types'; // Adjust the path as needed
import { TeacherRes, TeacherCreateReq, TeacherUpdateReq } from './types';

@Injectable({
    providedIn: 'root',
})
export class TeacherService {
    private apiUrl = '/api/teachers';

    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch?: string; departmentIds?: string[]; positionIds?: string[] }): Observable<Response<TeacherRes[]>> {
        return this.http.get<Response<TeacherRes[]>>(this.apiUrl, { params: filter });
    }

    getById(teacherId: string): Observable<Response<TeacherRes>> {
        return this.http.get<Response<TeacherRes>>(`${this.apiUrl}/${teacherId}`);
    }

    create(req: TeacherCreateReq): Observable<Response<TeacherRes>> {
        return this.http.post<Response<TeacherRes>>(this.apiUrl, req);
    }

    update(teacherId: string, req: TeacherUpdateReq): Observable<Response<TeacherRes>> {
        return this.http.put<Response<TeacherRes>>(`${this.apiUrl}/${teacherId}`, req);
    }

    delete(teacherId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${teacherId}`);
    }

    deleteRange(ids: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, { body: ids });
    }
}
