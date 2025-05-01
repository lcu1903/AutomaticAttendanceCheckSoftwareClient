import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/response.types';
import { SystemPositionCreateReq, SystemPositionRes, SystemPositionUpdateReq } from './types';

@Injectable({
    providedIn: 'root',
})
export class SystemPositionService {
    constructor(private http: HttpClient) {}

    getAll(params?: { textSearch?: string }): Observable<Response<SystemPositionRes[]>> {
        return this.http.get<Response<SystemPositionRes[]>>('api/system-positions', { params });
    }

    getById(systemPositionId: string): Observable<Response<SystemPositionRes>> {
        return this.http.get<Response<SystemPositionRes>>(`api/system-positions/${systemPositionId}`);
    }

    create(req: SystemPositionCreateReq): Observable<Response<SystemPositionRes>> {
        return this.http.post<Response<SystemPositionRes>>('api/system-positions', req);
    }

    update(systemPositionId: string, req: SystemPositionUpdateReq): Observable<Response<SystemPositionRes>> {
        return this.http.put<Response<SystemPositionRes>>(`api/system-positions/${systemPositionId}`, req);
    }

    delete(systemPositionId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`api/system-positions/${systemPositionId}`);
    }
    deleteRange(systemPositionIds: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`api/system-positions/delete-range`, {
            body: systemPositionIds,
        });
    }
}
