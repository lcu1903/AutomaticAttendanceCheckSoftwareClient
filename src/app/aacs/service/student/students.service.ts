import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../../../core/response.types'; // Adjust the path as needed
import { StudentRes, StudentCreateReq, StudentUpdateReq } from './types';

@Injectable({
    providedIn: 'root',
})
export class StudentService {
    private apiUrl = '/api/students';

    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch?: string; departmentIds?: string[]; positionIds?: string[] }): Observable<Response<StudentRes[]>> {
        return this.http.get<Response<StudentRes[]>>(this.apiUrl, { params: filter });
    }

    getById(studentId: string): Observable<Response<StudentRes>> {
        return this.http.get<Response<StudentRes>>(`${this.apiUrl}/${studentId}`);
    }

    create(req: StudentCreateReq): Observable<Response<StudentRes>> {
        return this.http.post<Response<StudentRes>>(this.apiUrl, req);
    }

    update(studentId: string, req: StudentUpdateReq): Observable<Response<StudentRes>> {
        return this.http.put<Response<StudentRes>>(`${this.apiUrl}/${studentId}`, req);
    }

    delete(studentId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${studentId}`);
    }

    deleteRange(ids: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, { body: ids });
    }
}
