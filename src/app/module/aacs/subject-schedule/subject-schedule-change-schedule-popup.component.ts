import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize, Subject, takeUntil } from 'rxjs';
import { z } from 'zod';
import { SubjectScheduleService } from '../../../aacs/service/subject-schedule/subject-schedule.service';
import {
    SubjectScheduleDetailChangeScheduleReq,
    SubjectScheduleDetailCreateReq,
    SubjectScheduleDetailRes,
    SubjectScheduleDetailUpdateReq,
    SubjectScheduleRes,
} from '../../../aacs/service/subject-schedule/types';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { WEEK_DAYS_OPTIONS_ISO } from '../../../utils/app.utils';
import { zodValidator } from '../../../utils/validation.utils';

@Component({
    selector: 'subject-schedule-change-schedule-popup',
    standalone: false,
    templateUrl: './subject-schedule-change-schedule-popup.component.html',
})
export class SubjectSchedulesChangeSchedulePopupComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    subjectSchedule: SubjectScheduleRes | null = null;
    instance: DynamicDialogComponent | undefined;
    changeScheduleForm!: FormGroup;
    isLoading: boolean = false;
    weekDayOptions: CmSelectOption[] = WEEK_DAYS_OPTIONS_ISO;
    changeScheduleSchema: z.ZodType = z.object({
        listScheduleDate: z.array(z.string()).min(1, 'system.error.required'),
        startTime: z.date({ required_error: 'system.error.required' }),
        endTime: z.date({ required_error: 'system.error.required' }),
    });
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private readonly _formBuilder: FormBuilder,
        private readonly _subjectScheduleService: SubjectScheduleService,
        private readonly _translocoService: TranslocoService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        const data = this.instance?.data as { subjectSchedule: SubjectScheduleRes | null };
        if (data) {
            this.subjectSchedule = data.subjectSchedule;
        }
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this.changeScheduleForm = this._formBuilder.group(
            {
                subjectScheduleId: this.subjectSchedule?.subjectScheduleId,
                startTime: [null],
                endTime: [null],
                listScheduleDate: [[]],
            },
            {
                validators: zodValidator(this.changeScheduleSchema),
            },
        );
    }
    onSave() {
        if (!this.changeScheduleForm.valid) {
            this.changeScheduleForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        let subjectScheduleId = this.subjectSchedule!.subjectScheduleId!;
        const formValue = this.changeScheduleForm.getRawValue();
        let req: SubjectScheduleDetailChangeScheduleReq = {
            subjectScheduleId: formValue.subjectScheduleId,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
            listScheduleDate: formValue.listScheduleDate,
        };
        this._subjectScheduleService
            .changeSchedule(subjectScheduleId, req)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => (this.isLoading = false)),
            )
            .subscribe((res) => {
                if (res.success) {
                    this.ref.close(true);
                }
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
}
