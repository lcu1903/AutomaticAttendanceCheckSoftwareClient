import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SemesterCreateReq, SemesterRes } from '../../../aacs/service/semester/types';
import { z } from 'zod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { zodValidator } from '../../../utils/validation.utils';
import { SemesterService } from '../../../aacs/service/semester/semester.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { get } from 'lodash';
import { UserService } from '../../../aacs/service/users/users.service';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import moment from 'moment';

@Component({
    selector: 'semester-popup',
    standalone: false,
    templateUrl: './semester-create-edit-popup.component.html',
})
export class SemesterCreateEditPopupComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    isLoading: boolean = false;
    instance: DynamicDialogComponent | undefined;

    semester: SemesterRes | null = null;
    teachers: CmSelectOption[] = [];
    departments: CmSelectOption[] = [];
    actionEnum: 'create' | 'edit' = 'create';
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private readonly _formBuilder: FormBuilder,
        private readonly _translocoService: TranslocoService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _semesterService: SemesterService,
        private readonly _systemDepartmentService: SystemDepartmentService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _userService: UserService,
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        const data = this.instance?.data as { semester: SemesterRes | null };
        if (data) {
            this.semester = data.semester;
            this.actionEnum = this.semester ? 'edit' : 'create';
        }
    }
    semesterForm!: FormGroup;
    createEditSemesterSchema: z.ZodType<SemesterCreateReq> = z.object({
        semesterName: z.string().min(1, 'system.error.required'),
    });
    ngOnInit(): void {
        this.semesterForm = this._formBuilder.group(
            {
                semesterId: this.semester?.semesterId,
                semesterName: this.semester?.semesterName || '',
                startDate: this.semester?.startDate ? moment(this.semester?.startDate).toDate() : null,
                endDate: this.semester?.endDate ? moment(this.semester?.endDate).toDate() : null,
            },
            {
                validators: zodValidator(this.createEditSemesterSchema),
            },
        );
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
        if (!this.semesterForm.valid) {
            this.semesterForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.semesterForm.getRawValue();
        if (this.actionEnum === 'create') {
            this._semesterService
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
            let semesterId = this.semester!.semesterId!;
            this._semesterService
                .update(semesterId, { ...formValue, semesterId: semesterId })
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
}
