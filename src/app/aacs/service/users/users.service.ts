import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Response } from '../../../core/response.types';
import { UserCreateReq, UserRes, UserUpdateReq } from './types';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private readonly _httpClient: HttpClient) {}
    private _user: ReplaySubject<UserRes> = new ReplaySubject<UserRes>(1);

    set user(value: UserRes) {
        this._user.next(value);
    }
    get user$(): Observable<UserRes> {
        return this._user.asObservable();
    }
    get userInfo(): UserRes {
        return JSON.parse(localStorage.getItem('user') ?? '') as unknown as UserRes;
    }

    getAllUsers(filter?: { textSearch?: string; departmentIds?: string[]; positionIds?: string[] }) {
        return this._httpClient.get<Response<UserRes[]>>(`api/users`, { params: filter });
    }

    getUserById(userId: string) {
        return this._httpClient.get<Response<UserRes>>(`api/users/${userId}`);
    }

    createUser(req: UserCreateReq) {
        return this._httpClient.post<Response<UserRes>>(`api/users`, req);
    }

    updateUser(userId: string, req: UserUpdateReq) {
        return this._httpClient.put<Response<UserRes>>(`api/users/${userId}`, req);
    }

    deleteUser(userId: string) {
        return this._httpClient.delete<Response<boolean>>(`api/users/${userId}`);
    }
    deleteRange(userIds: string[]) {
        return this._httpClient.delete<Response<boolean>>(`api/users/delete-range`, { body: userIds });
    }
}
