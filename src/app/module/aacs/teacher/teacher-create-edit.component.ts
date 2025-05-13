import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil, debounceTime, finalize } from 'rxjs';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { SystemPositionService } from '../../../aacs/service/system-position/system-position.service';
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
import { TeacherService } from '../../../aacs/service/teacher/teachers.service';
import { TeacherRes, TeacherCreateReq, TeacherUpdateReq } from '../../../aacs/service/teacher/types';
export interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'teacher-create-edit',
    standalone: false,
    templateUrl: './teacher-create-edit.component.html',
})
export class TeachersCreateEditComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    teacher: TeacherRes | null = null;
    departments: CmSelectOption[] = [];
    positions: CmSelectOption[] = [];
    classes: CmSelectOption[] = [];
    isLoading = false;
    teacherId: string | null = null;
    action: 'create' | 'edit' = 'create';
    constructor(
        private readonly _teacherService: TeacherService,
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
            this.teacherId = params['id'];
            if (this.teacherId) {
                this.action = 'edit';
                this.getTeacherById(this.teacherId);
            } else {
                this.action = 'create';
            }
        });
    }
    teacherSchema: z.ZodSchema<TeacherCreateReq> = z.object({
        teacherCode: z.string().min(1, 'system.error.required'),
        fullName: z.string().min(1, 'system.error.required'),
        userName: z.string().min(1, 'system.error.required'),
    });
    teacherForm!: FormGroup;
    ngOnInit(): void {
        this.getDepartments();
        this.getPositions();
        this.getClasses();
        this.teacherForm = this._formBuilder.group(
            {
                teacherCode: [''],
                classId: [null],
                fullName: [''],
                email: [null],
                phoneNumber: [null],
                departmentId: [null],
                positionId: [null],
                birthdate: [null],
                imageUrl: [null],
                userName: [''],
            },
            {
                validators: zodValidator(this.teacherSchema),
            },
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getTeacherById(teacherId: string) {
        this.isLoading = true;
        this._teacherService
            .getById(teacherId)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.teacher = res.data;
                this.teacherForm.patchValue({
                    fullName: this.teacher?.user?.fullName,
                    email: this.teacher?.user?.email,
                    phoneNumber: this.teacher?.user?.phoneNumber,
                    departmentId: this.teacher?.user?.departmentId,
                    positionId: this.teacher?.user?.positionId,
                    teacherCode: this.teacher?.teacherCode,
                    birthdate: this.teacher?.user?.birthdate ? moment(this.teacher?.user?.birthdate).toDate() : null,
                    imageUrl: this.teacher?.user?.imageUrl,
                    userName: this.teacher?.user?.userName,
                    userId: this.teacher?.user?.userId,
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
                this._router.navigate(['/teachers']);
            },
            () => {},
        );
    }
    onSave() {
        if (this.teacherForm.invalid) {
            this.teacherForm.markAllAsTouched();
            return;
        }
        this.teacherForm.patchValue({
            ...trimFormValues(this.teacherForm.value),
        });
        console.log('Form value:', this.teacherForm.value);

        if (this.action === 'create') {
            let teacher: TeacherCreateReq = {
                fullName: this.teacherForm.value.fullName,
                email: this.teacherForm.value.email,
                phoneNumber: this.teacherForm.value.phoneNumber,
                departmentId: this.teacherForm.value.departmentId,
                positionId: this.teacherForm.value.positionId,
                birthdate: this.teacherForm.value.birthdate,
                teacherCode: this.teacherForm.value.teacherCode,
                imageUrl: this.teacherForm.value.imageUrl,
                userName: this.teacherForm.value.userName,
            };
            this._teacherService.create(teacher).subscribe((res) => {
                if (res.data) {
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                    this._router.navigate(['/teachers']);
                }
            });
        } else {
            let teacher: TeacherUpdateReq = {
                teacherId: this.teacherId!,
                fullName: this.teacherForm.value.fullName,
                email: this.teacherForm.value.email,
                phoneNumber: this.teacherForm.value.phoneNumber,
                departmentId: this.teacherForm.value.departmentId,
                positionId: this.teacherForm.value.positionId,
                birthdate: this.teacherForm.value.birthdate,
                imageUrl: this.teacherForm.value.imageUrl,
                teacherCode: this.teacherForm.value.teacherCode,
                userName: this.teacherForm.value.userName,
                userId: this.teacher?.userId!,
            };
            this._teacherService.update(this.teacherId!, teacher).subscribe((res) => {
                if (res.data) {
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                    this._router.navigate(['/teachers']);
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
                    this.teacherForm.patchValue({
                        imageUrl: res.data,
                    });
                }
            });
        }
    }
    onRemoveImage() {
        this.teacherForm.patchValue({
            imageUrl: null,
        });
    }
}
