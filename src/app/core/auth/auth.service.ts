import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService } from '../../aacs/service/auth-management/auth-management.service';
import { Router } from '@angular/router';
import { UserService } from '../../aacs/service/users/users.service';
import { Observable, of, switchMap } from 'rxjs';
import { LoginReq, LoginRes, RegisterReq } from '../../aacs/service/auth-management/types';
import { Response } from '../response.types';
import { UserRes } from '../../aacs/service/users/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService,
        private readonly _accountService: AccountService,
        private _router: Router,
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    set refreshToken(token: string) {
        localStorage.setItem('refreshToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    get refreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/ForgotPassword', {
            email,
            clientURI: `https://${window.location.host}/reset-password`
        });
    }

    // isAuthorizedToViewPage(urlPage: string): Observable<Response<boolean>> {
    //     let controller = urlPage.split('/')[1];
    //     controller = controller.split('?')[0]
    //     return this._httpClient.get<Response<boolean>>(
    //         `api/button-authoritys/${encodeURIComponent(controller)}/have-permission`
    //     );
    // }


    // resetPassword(password: string, email: string, token: string): Observable<any> {
    //     return this._accountService.changePassword({
    //         password,
    //         confirmPassword: password,
    //         email: email,
    //         token: token
    //     })
    // }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: LoginReq): Observable<Response<LoginRes>> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            // return throwError('User is already logged in.');
            return of({} as Response<LoginRes>);
        }

        return this._accountService.login(credentials)
            .pipe(
                switchMap((response: Response<LoginRes>) => {
                    this.accessToken = response.data.token!.accessToken!;
                    this.refreshToken = response.data.token!.refreshToken!;
                    this._authenticated = true;
                    return of(response);
                })
            )
            .pipe(
                switchMap((res: Response<LoginRes>) => {
                    // Store the user on the user service
                    this._userService.user = res.data.user!;
                    localStorage.setItem('user', JSON.stringify(res.data.user));
                    return of(res);
                })
            );
    }
    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: RegisterReq): Observable<any> {
        return this._accountService.register(user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }
    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        return this._accountService.refresh({
            refreshToken: this.refreshToken
        })
            .pipe(
                switchMap((response: Response<LoginRes>) => {
                    localStorage.clear();
                    this.accessToken = response.data.token!.accessToken!;
                    this.refreshToken = response.data.token!.refreshToken!;
                    this._authenticated = true;
                    return of(response.data.user!);
                })
            )
            .pipe(
                switchMap((user: UserRes) => {
                    // Store the user on the user service
                    this._userService.user = user;
                    localStorage.setItem('user', JSON.stringify(user));
                    return of(user);
                })
            );
    }


    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        // if (AuthUtils.isTokenExpired(this.accessToken)) {
        //     return of(false);
        // }
        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }


}
