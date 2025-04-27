import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../../core/response.types';
import { SystemPageCreateReq, SystemPageRes, SystemPageUpdateReq } from './types';

@Injectable({
    providedIn: 'root',
})
export class SystemPageService {
    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch?: string }): Observable<Response<SystemPageRes[]>> {
        return this.http.get<Response<SystemPageRes[]>>('api/system-pages', {
            params: filter,
        });
    }

    getById(systemPageId: string): Observable<Response<SystemPageRes>> {
        return this.http.get<Response<SystemPageRes>>(`${'api/system-pages'}/${systemPageId}`);
    }

    create(req: SystemPageCreateReq): Observable<Response<SystemPageRes>> {
        return this.http.post<Response<SystemPageRes>>('api/system-pages', req);
    }

    update(systemPageId: string, req: SystemPageUpdateReq): Observable<Response<SystemPageRes>> {
        return this.http.put<Response<SystemPageRes>>(`${'api/system-pages'}/${systemPageId}`, req);
    }

    delete(systemPageId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${'api/system-pages'}/${systemPageId}`);
    }
}
