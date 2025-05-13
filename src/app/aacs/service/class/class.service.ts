import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ClassCreateReq, ClassRes, ClassUpdateReq } from './types';
import { Response } from '../../../core/response.types';

@Injectable({
    providedIn: 'root',
})
export class ClassService {
    private apiUrl = '/api/classes';

    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch?: string }): Observable<Response<ClassRes[]>> {
        return this.http.get<Response<ClassRes[]>>(this.apiUrl, { params: { ...filter } });
    }

    getById(classId: string): Observable<Response<ClassRes>> {
        return this.http.get<Response<ClassRes>>(`${this.apiUrl}/${classId}`);
    }

    create(req: ClassCreateReq): Observable<Response<ClassRes>> {
        return this.http.post<Response<ClassRes>>(this.apiUrl, req);
    }

    update(classId: string, req: ClassUpdateReq): Observable<Response<ClassRes>> {
        return this.http.put<Response<ClassRes>>(`${this.apiUrl}/${classId}`, req);
    }

    delete(classId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${classId}`);
    }

    deleteRange(classIds: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, {
            body: classIds,
        });
    }
}
