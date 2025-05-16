import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
    SubjectScheduleRes,
    SubjectScheduleCreateReq,
    SubjectScheduleUpdateReq,
    SubjectScheduleDetailChangeScheduleReq,
    SubjectScheduleDetailRes,
    SubjectScheduleDetailCreateReq,
    SubjectScheduleDetailUpdateReq,
} from './types'; // Adjust path as needed
import { Response } from '../../../core/response.types'; // Adjust path as needed

@Injectable({
    providedIn: 'root',
})
export class SubjectScheduleService {
    private apiUrl = '/api/subject-schedules';

    constructor(private http: HttpClient) {}

    getAll(filter?: { textSearch?: string; classIds?: string[]; semesterIds?: string[] }): Observable<Response<SubjectScheduleRes[]>> {
        return this.http.get<Response<SubjectScheduleRes[]>>(this.apiUrl, { params: filter });
    }

    getById(subjectScheduleId: string): Observable<Response<SubjectScheduleRes>> {
        return this.http.get<Response<SubjectScheduleRes>>(`${this.apiUrl}/${subjectScheduleId}`);
    }

    create(req: SubjectScheduleCreateReq): Observable<Response<SubjectScheduleRes>> {
        return this.http.post<Response<SubjectScheduleRes>>(this.apiUrl, req);
    }

    update(subjectScheduleId: string, req: SubjectScheduleUpdateReq): Observable<Response<SubjectScheduleRes>> {
        return this.http.put<Response<SubjectScheduleRes>>(`${this.apiUrl}/${subjectScheduleId}`, req);
    }

    delete(subjectScheduleId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${subjectScheduleId}`);
    }

    deleteRange(ids: string[]): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/delete-range`, { body: ids });
    }
    changeSchedule(subjectScheduleId: string, req: SubjectScheduleDetailChangeScheduleReq): Observable<Response<SubjectScheduleDetailRes[]>> {
        return this.http.put<Response<SubjectScheduleDetailRes[]>>(`${this.apiUrl}/${subjectScheduleId}/change-schedule`, req);
    }

    addDetail(subjectScheduleId: string, req: SubjectScheduleDetailCreateReq): Observable<Response<SubjectScheduleDetailRes[]>> {
        return this.http.post<Response<SubjectScheduleDetailRes[]>>(`${this.apiUrl}/${subjectScheduleId}/add-detail`, req);
    }

    deleteDetail(subjectScheduleDetailId: string, subjectScheduleId: string): Observable<Response<boolean>> {
        return this.http.delete<Response<boolean>>(`${this.apiUrl}/${subjectScheduleId}/detail/${subjectScheduleDetailId}`);
    }
    updateDetail(
        subjectScheduleId: string,
        subjectScheduleDetailId: string,
        req: SubjectScheduleDetailUpdateReq,
    ): Observable<Response<SubjectScheduleDetailRes>> {
        return this.http.put<Response<SubjectScheduleDetailRes>>(`${this.apiUrl}/${subjectScheduleId}/detail/${subjectScheduleDetailId}`, req);
    }
}
