import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import {
    SystemPositionCreateReq,
    SystemPositionRes,
} from '../../../aacs/service/system-position/types';
import { z } from 'zod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { zodValidator } from '../../../utils/validation.utils';
import { SystemPositionService } from '../../../aacs/service/system-position/system-position.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';

@Component({
    selector: 'system-positions-popup',
    standalone: false,
    templateUrl: './system-positions-create-edit-popup.component.html',
})
export class SystemPositionsCreateEditPopupComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    isLoading: boolean = false;
    instance: DynamicDialogComponent | undefined;

    position: SystemPositionRes | null = null;
    positions: CmSelectOption[] = [];
    actionEnum: 'create' | 'edit' = 'create';
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private readonly _formBuilder: FormBuilder,
        private readonly _translocoService: TranslocoService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _positionService: SystemPositionService,
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        const data = this.instance?.data as { position: SystemPositionRes | null };
        if (data) {
            this.position = data.position;
            this.actionEnum = this.position ? 'edit' : 'create';
        }
    }
    positionForm!: FormGroup;
    createEditPositionSchema: z.ZodType<SystemPositionCreateReq> = z.object({
        positionName: z.string().min(1, 'system.error.required'),
        positionParentId: z.string().nullable(),
        description: z.string().nullable(),
    });
    ngOnInit(): void {
        this.positionForm = this._formBuilder.group(
            {
                positionName: [this.position?.positionName || ''],
                positionParentId: [this.position?.positionParentId || null],
                description: [this.position?.description || null],
            },
            {
                validators: zodValidator(this.createEditPositionSchema),
            },
        );
        this.getAllParentPositions();
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllParentPositions() {
        this.isLoading = true;
        this._positionService
            .getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.positions = res.data
                    .filter((e) => e.positionId != this.position?.positionId)
                    .map((item) => {
                        return {
                            id: item.positionId,
                            name: item.positionName,
                        };
                    });
                this.isLoading = false;
                console.log('Form value:', this.positionForm.value);
                console.log('Positions:', this.positions);
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
        if (!this.positionForm.valid) {
            this.positionForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        const formValue = this.positionForm.getRawValue();
        if (this.actionEnum === 'create') {
            this._positionService
                .create(formValue)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.data) {
                        this.isLoading = false;
                        this.ref.close(res.data);
                    }
                });
            return;
        }
        if (this.actionEnum === 'edit') {
            let positionId = this.position!.positionId!;
            this._positionService
                .update(positionId, { ...formValue, positionId: positionId })
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
