import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SubjectCreateReq, SubjectRes } from '../../../aacs/service/subject/types';
import { z } from 'zod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { zodValidator } from '../../../utils/validation.utils';
import { SubjectService } from '../../../aacs/service/subject/subject.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { get } from 'lodash';
import { UserService } from '../../../aacs/service/users/users.service';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import moment from 'moment';

@Component({
    selector: 'subject-popup',
    standalone: false,
    templateUrl: './subject-create-edit-popup.component.html',
})
export class SubjectCreateEditPopupComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    isLoading: boolean = false;
    instance: DynamicDialogComponent | undefined;

    subject: SubjectRes | null = null;
    teachers: CmSelectOption[] = [];
    departments: CmSelectOption[] = [];
    actionEnum: 'create' | 'edit' = 'create';
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private readonly _formBuilder: FormBuilder,
        private readonly _translocoService: TranslocoService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _subjectService: SubjectService,
        private readonly _systemDepartmentService: SystemDepartmentService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _userService: UserService,
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        const data = this.instance?.data as { subject: SubjectRes | null };
        if (data) {
            this.subject = data.subject;
            this.actionEnum = this.subject ? 'edit' : 'create';
        }
    }
    subjectForm!: FormGroup;
    createEditSubjectSchema: z.ZodType<SubjectCreateReq> = z.object({
        subjectCode: z.string().min(1, 'system.error.required'),
        subjectCredits: z.number().min(1, 'common.mustBePositive'),
    });
    ngOnInit(): void {
        this.subjectForm = this._formBuilder.group(
            {
                subjectId: this.subject?.subjectId,
                subjectName: this.subject?.subjectName || '',
                subjectCode: this.subject?.subjectCode || '',
                subjectCredits: this.subject?.subjectCredits || 0,
            },
            {
                validators: zodValidator(this.createEditSubjectSchema),
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
        if (!this.subjectForm.valid) {
            this.subjectForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.subjectForm.getRawValue();
        if (this.actionEnum === 'create') {
            this._subjectService
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
            let subjectId = this.subject!.subjectId!;
            this._subjectService
                .update(subjectId, { ...formValue, subjectId: subjectId })
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
