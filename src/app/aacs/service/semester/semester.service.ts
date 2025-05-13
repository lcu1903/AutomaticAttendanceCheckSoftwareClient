import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response } from '../../../core/response.types'; // Adjust path as needed
import { SemesterRes, SemesterCreateReq, SemesterUpdateReq } from './types'; // Adjust path as needed

@Injectable({
    providedIn: 'root',
})
export class SemesterService {
    private apiUrl = '/api/semesters';

    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch?: string }): Observable<Response<SemesterRes[]>> {
        return this.http.get<Response<SemesterRes[]>>(this.apiUrl, { params: filter });
    }

    getById(semesterId: string): Observable<Response<SemesterRes>> {
        return this.http.get<Response<SemesterRes>>(`${this.apiUrl}/${semesterId}`);
    }

    create(req: SemesterCreateReq): Observable<Response<SemesterRes>> {
        return this.http.post<Response<SemesterRes>>(this.apiUrl, req);
    }

    update(semesterId: string, req: SemesterUpdateReq): Observable<Response<SemesterRes>> {
        return this.http.put<Response<SemesterRes>>(`${this.apiUrl}/${semesterId}`, req);
    }

    delete(semesterId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${semesterId}`);
    }

    deleteRange(ids: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, { body: ids });
    }
}
