import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Response } from "../../../core/response.types";
import { UserCreateReq, UserRes, UserUpdateReq } from "./types";

@Injectable({
    providedIn: "root"
})
export class UserService {
    constructor(
        private readonly _httpClient: HttpClient
    ) { }
    private _user: Subject<UserRes> = new Subject<UserRes>();

    set user(value: UserRes) {
        this._user.next(value);
    }
    get user$(): Observable<UserRes> {
        return this._user.asObservable();
    }

    getAllUsers() {
        return this._httpClient.get<Response<UserRes[]>>(`api/users`);
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
}