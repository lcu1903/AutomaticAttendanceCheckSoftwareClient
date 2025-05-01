import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SystemDepartmentCreateReq, SystemDepartmentRes, SystemDepartmentUpdateReq } from './types';
import { Response } from '../../../core/response.types';

@Injectable({
    providedIn: 'root',
})
export class SystemDepartmentService {
    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch: string | null }): Observable<Response<SystemDepartmentRes[]>> {
        let params = new HttpParams();
        if (filter?.textSearch) {
            params = params.set('textSearch', filter.textSearch);
        }

        return this.http.get<Response<SystemDepartmentRes[]>>('api/system-departments', { params });
    }

    getById(systemDepartmentId: string): Observable<Response<SystemDepartmentRes>> {
        return this.http.get<Response<SystemDepartmentRes>>(`api/system-departments/${systemDepartmentId}`);
    }

    create(req: SystemDepartmentCreateReq): Observable<Response<SystemDepartmentRes>> {
        return this.http.post<Response<SystemDepartmentRes>>('api/system-departments', req);
    }

    update(systemDepartmentId: string, req: SystemDepartmentUpdateReq): Observable<Response<SystemDepartmentRes>> {
        return this.http.put<Response<SystemDepartmentRes>>(`api/system-departments/${systemDepartmentId}`, req);
    }

    delete(systemDepartmentId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`api/system-departments/${systemDepartmentId}`);
    }
    deleteRange(systemDepartmentIds: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`api/system-departments/delete-range`, {
            body: systemDepartmentIds,
        });
    }
}
