import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ClassCreateReq, ClassRes } from '../../../aacs/service/class/types';
import { z } from 'zod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { zodValidator } from '../../../utils/validation.utils';
import { ClassService } from '../../../aacs/service/class/class.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { get } from 'lodash';
import { UserService } from '../../../aacs/service/users/users.service';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import moment from 'moment';

@Component({
    selector: 'classes-popup',
    standalone: false,
    templateUrl: './classes-create-edit-popup.component.html',
})
export class ClassCreateEditPopupComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    isLoading: boolean = false;
    instance: DynamicDialogComponent | undefined;

    class: ClassRes | null = null;
    teachers: CmSelectOption[] = [];
    departments: CmSelectOption[] = [];
    actionEnum: 'create' | 'edit' = 'create';
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private readonly _formBuilder: FormBuilder,
        private readonly _translocoService: TranslocoService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _classService: ClassService,
        private readonly _systemDepartmentService: SystemDepartmentService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _userService: UserService,
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        const data = this.instance?.data as { class: ClassRes | null };
        if (data) {
            this.class = data.class;
            this.actionEnum = this.class ? 'edit' : 'create';
        }
    }
    classForm!: FormGroup;
    createEditClassSchema: z.ZodType<ClassCreateReq> = z.object({
        className: z.string().min(1, 'system.error.required'),
        classCode: z.string().min(1, 'system.error.required'),
    });
    ngOnInit(): void {
        this.classForm = this._formBuilder.group(
            {
                className: this.class?.className || '',
                classCode: this.class?.classCode || '',
                classId: this.class?.classId,
                schoolYearStart: this.class?.schoolYearStart ? moment(this.class?.schoolYearStart).toDate() : null,
                schoolYearEnd: this.class?.schoolYearEnd ? moment(this.class?.schoolYearEnd).toDate() : null,
                room: this.class?.room,
                departmentId: this.class?.departmentId,
                headTeacherId: this.class?.headTeacherId,
            },
            {
                validators: zodValidator(this.createEditClassSchema),
            },
        );
        this.getDepartments();
        this.getTeachers();
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
                this.departments = res.data.map((item) => ({
                    id: item.departmentId,
                    name: item.departmentName,
                }));
            });
    }
    onClose() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.message.unsavedChanges'),
            this._translocoService.translate('common.message.unsavedChangesConfirm'),
            () => {
                this.ref.close();
            },
            () => {},
        );
    }
    onSave() {
        if (!this.classForm.valid) {
            this.classForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.classForm.getRawValue();
        if (this.actionEnum === 'create') {
            this._classService
                .create(formValue)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.ref.close(res.data);
                    }
                });
            return;
        }
        if (this.actionEnum === 'edit') {
            let classId = this.class!.classId!;
            this._classService
                .update(classId, { ...formValue, classId: classId })
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.ref.close(res.data);
                    }
                });
            return;
        }
    }
    getTeachers() {
        this._userService
            .getTeacher()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.teachers = res.data.map((item) => ({
                    id: item.userId,
                    name: item.fullName ?? '',
                }));
            });
    }
}
