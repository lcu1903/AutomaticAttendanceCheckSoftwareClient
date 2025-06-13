import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserRes } from '../users/types';
import { Response } from '../../../core/response.types';

export interface FaceCheckReq {
    imageData: string;
    subjectScheduleDetailId?: string;
}

@Injectable({ providedIn: 'root' })
export class FaceDetectionService {
    private apiUrl = '/api/face-detections/check';

    constructor(private http: HttpClient) {}

    checkFace(req: FaceCheckReq): Observable<Response<UserRes>> {
        return this.http.post<Response<UserRes>>(this.apiUrl, req);
    }
}
