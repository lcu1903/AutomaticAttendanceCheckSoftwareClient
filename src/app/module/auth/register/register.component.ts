import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize, Subject, takeUntil } from 'rxjs';
import { LoginReq, RegisterReq } from '../../../aacs/service/auth-management/types';
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
    selector: 'app-register',
    imports: [FormsModule, ReactiveFormsModule, TranslocoModule, CmInputComponent, CommonModule],
    templateUrl: './register.component.html',
    standalone: true,
})
export class RegisterComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
    isLoading: boolean = false;
    registerSchema: z.ZodType<RegisterReq> = z.object({
        userName: z.string().min(1, { message: 'system.error.required' }),
        password: z.string().min(1, { message: 'system.error.required' }),
        email: z.string().email({ message: 'error.invalidEmail' }).min(1, { message: 'system.error.required' }),
        phoneNumber: z.string().optional().nullable(),
        fullName: z.string().optional().nullable(),
    });
    registerForm!: FormGroup;
    constructor(
        private readonly _formBuilder: FormBuilder,
        private readonly _translocoService: TranslocoService,
        private readonly _authService: AuthService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _router: Router,
    ) {}

    ngOnInit(): void {
        this.registerForm = this._formBuilder.group(
            {
                userName: [''],
                password: [''],
                email: [''],
                phoneNumber: [null],
                fullName: [null],
            },
            {
                validators: zodValidator(this.registerSchema),
            },
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    onSubmit() {
        if (!this.registerForm.valid) {
            this.registerForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.registerForm.getRawValue();
        const registerReq: RegisterReq = {
            userName: formValue.userName,
            password: formValue.password,
            email: formValue.email,
            phoneNumber: formValue.phoneNumber,
            fullName: formValue.fullName,
        };
        this._authService
            .signUp(registerReq)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                if (res.success) {
                    const redirectURL = '/login';
                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'message.registerSuccess');
                } else {
                    this._messagePopupService.show(PopupType.ERROR, null, res.errors?.join(', '));
                    this.registerForm.enable();
                }
            });
    }
}
