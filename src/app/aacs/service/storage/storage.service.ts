import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Response } from '../../../core/response.types';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private readonly _httpClient: HttpClient) {}

    upload(formData: FormData) {
        return this._httpClient.post<Response<string>>(`api/storage/upload`, formData);
    }
}
