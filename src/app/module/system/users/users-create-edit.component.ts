import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil, debounceTime, finalize } from 'rxjs';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { SystemPositionService } from '../../../aacs/service/system-position/system-position.service';
import { UserCreateReq, UserRes, UserUpdateReq } from '../../../aacs/service/users/types';
import { UserService } from '../../../aacs/service/users/users.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { SystemDepartmentRes } from '../../../aacs/service/system-department/types';
import { SystemPositionRes } from '../../../aacs/service/system-position/types';
import { ActivatedRoute, Router } from '@angular/router';
import { z, ZodSchema } from 'zod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { zodValidator } from '../../../utils/validation.utils';
import moment from 'moment';
import { ClassService } from '../../../aacs/service/class/class.service';
import { StorageService } from '../../../aacs/service/storage/storage.service';
import { trimFormValues } from '../../../utils/app.utils';
export interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'system-user-create-edit',
    standalone: false,
    templateUrl: './users-create-edit.component.html',
})
export class SystemUsersCreateEditComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    user: UserRes | null = null;
    departments: CmSelectOption[] = [];
    positions: CmSelectOption[] = [];
    classes: CmSelectOption[] = [];
    isLoading = false;
    userId: string | null = null;
    action: 'create' | 'edit' = 'create';
    constructor(
        private readonly _systemUserService: UserService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _systemDepartmentService: SystemDepartmentService,
        private readonly _systemPositionService: SystemPositionService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _formBuilder: FormBuilder,
        private readonly _classService: ClassService,
        private readonly _storageService: StorageService,
    ) {
        this._activatedRoute.params.subscribe((params) => {
            this.userId = params['id'];
            if (this.userId) {
                this.action = 'edit';
                this.getUserById(this.userId);
            } else {
                this.action = 'create';
            }
        });
    }
    userSchema: z.ZodSchema<UserCreateReq> = z.object({
        userName: z.string().min(1, 'system.error.required'),
        fullName: z.string().min(1, 'system.error.required'),
    });
    userForm!: FormGroup;
    ngOnInit(): void {
        this.getDepartments();
        this.getPositions();
        this.getClasses();
        this.userForm = this._formBuilder.group(
            {
                userName: [''],
                fullName: [''],
                email: [null],
                phoneNumber: [null],
                departmentId: [null],
                positionId: [null],
                birthdate: [null],
                studentCode: [null],
                classId: [null],
                teacherCode: [null],
                imageUrl: [null],
            },
            {
                validators: zodValidator(this.userSchema),
            },
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getUserById(userId: string) {
        this.isLoading = true;
        this._systemUserService
            .getUserById(userId)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.user = res.data;
                this.userForm.patchValue({
                    userName: this.user?.userName,
                    fullName: this.user?.fullName,
                    email: this.user?.email,
                    phoneNumber: this.user?.phoneNumber,
                    departmentId: this.user?.departmentId,
                    positionId: this.user?.positionId,
                    studentCode: this.user?.studentCode,
                    classId: this.user?.classId,
                    teacherCode: this.user?.teacherCode,
                    birthdate: this.user?.birthdate ? moment(this.user?.birthdate).toDate() : null,
                    imageUrl: this.user?.imageUrl,
                });
            });
    }
    getDepartments() {
        this._systemDepartmentService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.departments = res.data.map((item: SystemDepartmentRes) => {
                    return {
                        id: item.departmentId,
                        name: item.departmentName,
                    };
                });
            });
    }
    getPositions() {
        this._systemPositionService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.positions = res.data.map((item: SystemPositionRes) => {
                    return {
                        id: item.positionId,
                        name: item.positionName,
                    };
                });
            });
    }
    onBack() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.message.unsavedChanges'),
            this._translocoService.translate('common.message.unsavedChangesConfirm'),
            () => {
                this._router.navigate(['/users']);
            },
            () => {},
        );
    }
    onSave() {
        if (this.userForm.invalid) {
            this.userForm.markAllAsTouched();
            return;
        }
        this.userForm.patchValue({
            ...trimFormValues(this.userForm.value),
        });
        console.log('Form value:', this.userForm.value);

        if (this.action === 'create') {
            this.isLoading = true;
            let user: UserCreateReq = {
                userName: this.userForm.value.userName,
                fullName: this.userForm.value.fullName,
                email: this.userForm.value.email,
                phoneNumber: this.userForm.value.phoneNumber,
                departmentId: this.userForm.value.departmentId,
                positionId: this.userForm.value.positionId,
                birthdate: this.userForm.value.birthdate,
                studentCode: this.userForm.value.studentCode,
                classId: this.userForm.value.classId,
                teacherCode: this.userForm.value.teacherCode,
                imageUrl: this.userForm.value.imageUrl,
            };
            this._systemUserService
                .createUser(user)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.data) {
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                        this._router.navigate(['/users']);
                    }
                });
        } else {
            this.isLoading = true;
            let user: UserUpdateReq = {
                userId: this.userId!,
                userName: this.userForm.value.userName,
                fullName: this.userForm.value.fullName,
                email: this.userForm.value.email,
                phoneNumber: this.userForm.value.phoneNumber,
                departmentId: this.userForm.value.departmentId,
                positionId: this.userForm.value.positionId,
                birthdate: this.userForm.value.birthdate,
                imageUrl: this.userForm.value.imageUrl,
                studentCode: this.userForm.value.studentCode,
                classId: this.userForm.value.classId,
                teacherCode: this.userForm.value.teacherCode,
            };
            this._systemUserService
                .updateUser(this.userId!, user)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.data) {
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                        this._router.navigate(['/users']);
                    }
                });
        }
    }
    getClasses() {
        this._classService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.classes = res.data.map((item) => {
                    return {
                        id: item.classId,
                        name: item.className,
                    };
                });
            });
    }
    uploadedFiles: any[] = [];
    onUpload(event: any) {
        for (let file of event.files) {
            let formData = new FormData();
            formData.append('file', file);
            this._storageService.upload(formData).subscribe((res) => {
                if (res.data) {
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'common.uploaded');
                    this.userForm.patchValue({
                        imageUrl: res.data,
                    });
                }
            });
        }
    }
    onRemoveImage() {
        this.userForm.patchValue({
            imageUrl: null,
        });
    }
}
