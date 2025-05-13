import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SystemDepartmentCreateReq, SystemDepartmentRes } from '../../../aacs/service/system-department/types';
import { z } from 'zod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { zodValidator } from '../../../utils/validation.utils';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';

@Component({
    selector: 'system-departments-popup',
    standalone: false,
    templateUrl: './system-departments-create-edit-popup.component.html',
})
export class SystemDepartmentsCreateEditPopupComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    isLoading: boolean = false;
    instance: DynamicDialogComponent | undefined;

    department: SystemDepartmentRes | null = null;
    departments: CmSelectOption[] = [];
    actionEnum: 'create' | 'edit' = 'create';
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private readonly _formBuilder: FormBuilder,
        private readonly _translocoService: TranslocoService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _departmentService: SystemDepartmentService,
        private readonly _messagePopupService: MessagePopupService,
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        const data = this.instance?.data as { department: SystemDepartmentRes | null };
        if (data) {
            this.department = data.department;
            this.actionEnum = this.department ? 'edit' : 'create';
        }
    }
    departmentForm!: FormGroup;
    createEditDepartmentSchema: z.ZodType<SystemDepartmentCreateReq> = z.object({
        departmentName: z.string().min(1, 'system.error.required'),
        departmentParentId: z.string().nullable(),
        description: z.string().nullable(),
    });
    ngOnInit(): void {
        this.departmentForm = this._formBuilder.group(
            {
                departmentName: [this.department?.departmentName || ''],
                departmentParentId: [this.department?.departmentParentId || null],
                description: [this.department?.description || null],
            },
            {
                validators: zodValidator(this.createEditDepartmentSchema),
            },
        );
        this.getAllParentDepartments();
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllParentDepartments() {
        this.isLoading = true;
        this._departmentService
            .getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.departments = res.data
                    .filter((e) => e.departmentId != this.department?.departmentId)
                    .map((item) => {
                        return {
                            id: item.departmentId,
                            name: item.departmentName,
                        };
                    });
                this.isLoading = false;
                console.log('Form value:', this.departmentForm.value);
                console.log('Departments:', this.departments);
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
        if (!this.departmentForm.valid) {
            this.departmentForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.departmentForm.getRawValue();
        if (this.actionEnum === 'create') {
            this._departmentService
                .create(formValue)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.data) {
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                        this.ref.close(res.data);
                    }
                });
            return;
        }
        if (this.actionEnum === 'edit') {
            let departmentId = this.department!.departmentId!;
            this._departmentService
                .update(departmentId, { ...formValue, departmentId: departmentId })
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.data) {
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                        this.ref.close(res.data);
                    }
                });
            return;
        }
    }
}
