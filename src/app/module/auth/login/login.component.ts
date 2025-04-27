import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoginReq } from '../../../aacs/service/auth-management/types';
import { z } from 'zod';
import { zodValidator } from '../../../utils/validation.utils';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CmInputComponent } from '../../../base-components/cm-inputs/cm-input.component';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../aacs/service/users/users.service';
import { AccountService } from '../../../aacs/service/auth-management/auth-management.service';
import { AuthService } from '../../../core/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
@Component({
    selector: 'app-login',
    imports: [FormsModule, ReactiveFormsModule, TranslocoModule, CmInputComponent, CommonModule],
    templateUrl: './login.component.html',
    standalone: true,
    styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    loginSchema: z.ZodType<LoginReq> = z.object({
        userName: z.string().min(1, { message: 'error.required' }),
        password: z.string().min(1, { message: 'error.required' }),
    });
    loginForm!: FormGroup;
    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _translocoService: TranslocoService,
        private readonly _authService: AuthService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _router: Router,
    ) {}

    ngOnInit(): void {
        this.loginForm = this._formBuilder.group(
            {
                userName: [''],
                password: [''],
            },
            {
                validators: zodValidator(this.loginSchema),
            },
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    onSubmit() {
        if (!this.loginForm.valid) {
            this.loginForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.loginForm.getRawValue();
        const loginReq: LoginReq = {
            userName: formValue.userName,
            password: formValue.password,
        };
        this._authService
            .signIn(loginReq)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                if (res.success) {
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/home';
                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'system.message.loginSuccess');
                } else {
                    this._messagePopupService.show(PopupType.ERROR, null, res.errors?.join(', ').toString());
                    this.loginForm.enable();
                }
            });
    }
}
