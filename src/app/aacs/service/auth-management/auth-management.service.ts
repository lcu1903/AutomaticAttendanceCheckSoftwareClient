import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Response } from "../../../core/response.types";
import { ChangePasswordReq, LoginReq, LoginRes, RefreshTokenReq, RegisterReq } from "./types";
import { UserRes } from "../users/types";

@Injectable({
    providedIn: "root"
})
export class AccountService {
    constructor(
        private readonly _httpClient: HttpClient
    ) {
    }

    login(req: LoginReq) {
        return this._httpClient.post<Response<LoginRes>>(`api/auth/login`, req);
    }


    register(req: RegisterReq) {
        return this._httpClient.post<Response<LoginRes>>(`api/auth/register`, req);
    }

    changePassword(req: ChangePasswordReq) {
        return this._httpClient.post<Response<UserRes>>(`api/auth/change-password`, req);
    }

    refresh(req: RefreshTokenReq) {
        return this._httpClient.post<Response<LoginRes>>(`api/auth/refresh-token`, req)
    }
}
