import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubjectRes, SubjectCreateReq, SubjectUpdateReq } from './types'; // Adjust path as needed
import { Response } from '../../../core/response.types'; // Adjust path as needed

@Injectable({
    providedIn: 'root',
})
export class SubjectService {
    private apiUrl = '/api/subjects';

    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch?: string }): Observable<Response<SubjectRes[]>> {
        return this.http.get<Response<SubjectRes[]>>(this.apiUrl, { params: filter });
    }

    getById(subjectId: string): Observable<Response<SubjectRes>> {
        return this.http.get<Response<SubjectRes>>(`${this.apiUrl}/${subjectId}`);
    }

    create(req: SubjectCreateReq): Observable<Response<SubjectRes>> {
        return this.http.post<Response<SubjectRes>>(this.apiUrl, req);
    }

    update(subjectId: string, req: SubjectUpdateReq): Observable<Response<SubjectRes>> {
        return this.http.put<Response<SubjectRes>>(`${this.apiUrl}/${subjectId}`, req);
    }

    delete(subjectId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${subjectId}`);
    }

    deleteRange(ids: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, { body: ids });
    }
}
