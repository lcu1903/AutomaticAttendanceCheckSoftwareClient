import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHandlerFn, HttpParams, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, concatMap, filter, iif, map, Observable, retryWhen, switchMap, take, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthUtils } from './auth.utils';
import { isNullOrWhiteSpace } from '../../utils/validation.uitls';
import { TranslateParams, TranslocoService } from '@jsverse/transloco';
let isRefreshing = false;
/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const translocoService = inject(TranslocoService);

    let refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    // Clone the request object
    let newReq = req.clone();
    const addTokenHeader = (request: HttpRequest<any>, token: string) => {
        /* for Spring Boot back-end */
        // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

        /* for Node.js Express back-end */
        return request.clone({
            headers: request.headers.set('Authorization', 'Bearer ' + authService.accessToken),
            params: removeNullValuesFromQueryParams(request.params)

        });;
    }
    // Request
    //
    // If the access token didn't expire, add the Authorization header.
    // We won't add the Authorization header if the access token expired.
    // This will force the server to return a "401 Unauthorized" response
    // for the protected API routes which our response interceptor will
    // catch and delete the access token from the local storage while logging
    // the user out from the app.
    if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
        newReq = addTokenHeader(req, authService.accessToken);
    }
    newReq = newReq.clone({
        params: removeNullValuesFromQueryParams(newReq.params)
    });
    // const handle400Error = (error: HttpErrorResponse) => {
    //     let listError = error.error.errors.map(e => {
    //         return translocoService.translate(e);
    //     })
    //     fuseConfirmationService.open({
    //         title: listError.join(', '),
    //         message: '',
    //         icon: {
    //             name: 'heroicons_solid:x-circle',
    //             color: 'error'
    //         },
    //         actions: {
    //             confirm: {
    //                 show: false
    //             }
    //         }

    //     })
    // }

    const handle400Error = (error: HttpErrorResponse) => {
        let listError = error.error.errors.filter((e: { key: string }) => !isNullOrWhiteSpace(e.key))
            .map((e: { key: string; description: string }) => {
                if (e.description == '_' || isNullOrWhiteSpace(e.description)) {
                    e.description = '';
                }
                return {
                    translatedKey: translocoService.translate(e.key),
                    translatedDescription: translocoService.translate(e.description)
                };
            })
        if (listError.length) {
            // fuseConfirmationService.open({
            //     title: listError.map(e => e.translatedKey).join(', '),
            //     message: listError.map(e => e.translatedDescription).join(', '),
            //     icon: {
            //         name: 'heroicons_outline:information-circle',
            //         color: 'error'
            //     },
            //     actions: {
            //         confirm: { show: false },
            //         cancel: { show: false }
            //     },
            //     dismissible: true,
            //     showXIcon: false
            // })
        } else {
            // fuseConfirmationService.open({
            //     title: 'message.invalidData',
            //     message: 'Vui lòng kiểm tra lại',
            //     icon: {
            //         name: 'heroicons_outline:information-circle',
            //         color: 'error'
            //     },
            //     actions: {
            //         confirm: { show: false },
            //         cancel: { show: false }
            //     },
            //     dismissible: true
            // })
        }
    }
    const handle401Error = (request: HttpRequest<any>, next: HttpHandlerFn) => {
        if (!isRefreshing) {
            isRefreshing = true;
            refreshTokenSubject.next(null);

            const token = authService.refreshToken;

            if (token)
                return authService.signInUsingToken().pipe(
                    switchMap((token: { accessToken: string, refreshToken: string }) => {
                        isRefreshing = false;
                        refreshTokenSubject.next(token.accessToken);

                        return next(addTokenHeader(request, token.accessToken));
                    }),
                    catchError((err) => {
                        isRefreshing = false;
                        authService.signOut();
                        return throwError(err);
                    })
                );

        }
        return refreshTokenSubject.pipe(
            filter(token => token !== null),
            take(1),
            switchMap((token) => next(addTokenHeader(request, token)))
        );

    }
    // Response
    return next(newReq).pipe(

        catchError((error) => {

            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401) {
                return handle401Error(req, next);
            }

            else if (error instanceof HttpErrorResponse && error.status === 400) {
                handle400Error(error);

            }
            else if (error instanceof HttpErrorResponse && error.status === 498) {

                authService.signOut().subscribe(resp => {
                    router.navigate(['sign-in']);
                });

            }
            // Catch "409 Conflict" responses
            else if (error instanceof HttpErrorResponse && error.status === 409) {
                let listError = error.error.errors.map((e: TranslateParams) => {
                    return translocoService.translate(e);
                })

                // fuseConfirmationService.open({
                //     title: listError.join(', '),
                //     message: '',
                //     icon: {
                //         name: 'heroicons_solid:x-circle',
                //         color: 'error'
                //     },
                //     actions: {
                //         confirm: {
                //             show: false
                //         }
                //     }

                // })
            }
            if (error instanceof HttpErrorResponse && error.status === 403) {
                // Sign out
                authService.signOut();

                // Reload the app
                location.reload();
            }

            // else if (error instanceof HttpErrorResponse && error.status === 429) {
            //     fuseConfirmationService.open({
            //         title: 'OTP vượt quá giới hạn yêu cầu',
            //         message: 'Vui lòng thử lại sau 30 giây',
            //         icon: {
            //             name: 'heroicons_outline:clock',
            //             color: 'error'
            //         },
            //         actions: {
            //             confirm: {
            //                 show: false
            //             }
            //         }

            //     })

            // }
            else if (error instanceof HttpErrorResponse && error.status >= 500) {


                // fuseConfirmationService.open({
                //     title: 'Lỗi lưu dữ liệu',
                //     message: 'Vui lòng thử lại sau!',
                //     icon: {
                //         name: 'heroicons_solid:x-circle',
                //         color: 'error'
                //     },
                //     actions: {
                //         confirm: {
                //             show: false
                //         }
                //     }

                // })

            }

            return throwError(error);
        }),
    );
};

const removeNullValuesFromQueryParams = (params: HttpParams) => {
    const paramsKeysAux = params.keys();
    paramsKeysAux.forEach((key) => {
        const value = params.get(key);
        if (value === null || value === undefined || value === 'undefined' || value === '' || value === 'null') {
            params['map'].delete(key);
        }
    });

    return params;
}
