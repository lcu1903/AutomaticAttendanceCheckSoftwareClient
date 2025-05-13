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
import { StudentService } from '../../../aacs/service/student/students.service';
import { StudentRes, StudentCreateReq, StudentUpdateReq } from '../../../aacs/service/student/types';
export interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'student-create-edit',
    standalone: false,
    templateUrl: './student-create-edit.component.html',
})
export class StudentsCreateEditComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    student: StudentRes | null = null;
    departments: CmSelectOption[] = [];
    positions: CmSelectOption[] = [];
    classes: CmSelectOption[] = [];
    isLoading = false;
    studentId: string | null = null;
    action: 'create' | 'edit' = 'create';
    constructor(
        private readonly _studentService: StudentService,
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
            this.studentId = params['id'];
            if (this.studentId) {
                this.action = 'edit';
                this.getStudentById(this.studentId);
            } else {
                this.action = 'create';
            }
        });
    }
    studentSchema: z.ZodSchema<StudentCreateReq> = z.object({
        studentCode: z.string().min(1, 'system.error.required'),
        fullName: z.string().min(1, 'system.error.required'),
        userName: z.string().min(1, 'system.error.required'),
    });
    studentForm!: FormGroup;
    ngOnInit(): void {
        this.getDepartments();
        this.getPositions();
        this.getClasses();
        this.studentForm = this._formBuilder.group(
            {
                studentCode: [''],
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
                validators: zodValidator(this.studentSchema),
            },
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getStudentById(studentId: string) {
        this.isLoading = true;
        this._studentService
            .getById(studentId)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.student = res.data;
                this.studentForm.patchValue({
                    fullName: this.student?.user?.fullName,
                    email: this.student?.user?.email,
                    phoneNumber: this.student?.user?.phoneNumber,
                    departmentId: this.student?.user?.departmentId,
                    positionId: this.student?.user?.positionId,
                    studentCode: this.student?.studentCode,
                    classId: this.student?.classId,
                    birthdate: this.student?.user?.birthdate ? moment(this.student?.user?.birthdate).toDate() : null,
                    imageUrl: this.student?.user?.imageUrl,
                    userName: this.student?.user?.userName,
                    userId: this.student?.userId,
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
                this._router.navigate(['/students']);
            },
            () => {},
        );
    }
    onSave() {
        if (this.studentForm.invalid) {
            this.studentForm.markAllAsTouched();
            return;
        }
        this.studentForm.patchValue({
            ...trimFormValues(this.studentForm.value),
        });
        console.log('Form value:', this.studentForm.value);

        if (this.action === 'create') {
            let student: StudentCreateReq = {
                fullName: this.studentForm.value.fullName,
                email: this.studentForm.value.email,
                phoneNumber: this.studentForm.value.phoneNumber,
                departmentId: this.studentForm.value.departmentId,
                positionId: this.studentForm.value.positionId,
                birthdate: this.studentForm.value.birthdate,
                studentCode: this.studentForm.value.studentCode,
                classId: this.studentForm.value.classId,
                imageUrl: this.studentForm.value.imageUrl,
                userName: this.studentForm.value.userName,
            };
            this._studentService.create(student).subscribe((res) => {
                if (res.data) {
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                    this._router.navigate(['/students']);
                }
            });
        } else {
            let student: StudentUpdateReq = {
                studentId: this.studentId!,
                fullName: this.studentForm.value.fullName,
                email: this.studentForm.value.email,
                phoneNumber: this.studentForm.value.phoneNumber,
                departmentId: this.studentForm.value.departmentId,
                positionId: this.studentForm.value.positionId,
                birthdate: this.studentForm.value.birthdate,
                imageUrl: this.studentForm.value.imageUrl,
                studentCode: this.studentForm.value.studentCode,
                classId: this.studentForm.value.classId,
                userName: this.studentForm.value.userName,
                userId: this.student?.userId!,
            };
            console.log('student:', student);

            this._studentService.update(this.studentId!, student).subscribe((res) => {
                if (res.data) {
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                    this._router.navigate(['/students']);
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
                    this.studentForm.patchValue({
                        imageUrl: res.data,
                    });
                }
            });
        }
    }
    onRemoveImage() {
        this.studentForm.patchValue({
            imageUrl: null,
        });
    }
}
