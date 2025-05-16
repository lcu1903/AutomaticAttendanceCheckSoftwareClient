import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import {
    SubjectScheduleDetailCreateReq,
    SubjectScheduleDetailRes,
    SubjectScheduleDetailUpdateReq,
    SubjectScheduleRes,
} from '../../../aacs/service/subject-schedule/types';
import { SubjectScheduleService } from '../../../aacs/service/subject-schedule/subject-schedule.service';
import { TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { z } from 'zod';
import { DialogService, DynamicDialogComponent, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SubjectRes } from '../../../aacs/service/subject/types';
import { zodValidator } from '../../../utils/validation.utils';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import moment from 'moment';

@Component({
    selector: 'subject-schedule-detail-create-edit-popup',
    standalone: false,
    templateUrl: './subject-schedule-detail-create-edit-popup.component.html',
})
export class SubjectSchedulesDetailCreateEditPopupComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    subjectScheduleDetail: SubjectScheduleDetailRes | null = null;
    subjectSchedule: SubjectScheduleRes | null = null;
    instance: DynamicDialogComponent | undefined;
    subjectScheduleDetailForm!: FormGroup;
    isLoading: boolean = false;
    actionEnum: 'create' | 'edit' = 'create';
    createEditSubjectSchema: z.ZodType = z.object({
        scheduleDate: z.date({ required_error: 'system.error.required' }),
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
        const data = this.instance?.data as { subjectScheduleDetail: SubjectScheduleDetailRes | null; subjectSchedule: SubjectScheduleRes | null };
        if (data) {
            this.subjectScheduleDetail = data.subjectScheduleDetail;
            this.subjectSchedule = data.subjectSchedule;
            console.log(data);

            this.actionEnum = this.subjectScheduleDetail ? 'edit' : 'create';
        }
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this.subjectScheduleDetailForm = this._formBuilder.group(
            {
                subjectScheduleDetailId: this.subjectScheduleDetail?.subjectScheduleDetailId,
                subjectScheduleId: this.subjectScheduleDetail?.subjectScheduleId,
                startTime: this.subjectScheduleDetail?.startTime ? moment(this.subjectScheduleDetail?.startTime).toDate() : null,
                endTime: this.subjectScheduleDetail?.endTime ? moment(this.subjectScheduleDetail?.endTime).toDate() : null,
                note: this.subjectScheduleDetail?.note,
                scheduleDate: this.subjectScheduleDetail?.scheduleDate ? moment(this.subjectScheduleDetail?.scheduleDate).toDate() : null,
            },
            {
                validators: zodValidator(this.createEditSubjectSchema),
            },
        );
        console.log(this.subjectScheduleDetailForm);
    }
    onSave() {
        if (!this.subjectScheduleDetailForm.valid) {
            this.subjectScheduleDetailForm.markAllAsTouched();
            return;
        }
        this.isLoading = true;
        let subjectScheduleId = this.subjectSchedule!.subjectScheduleId!;
        const formValue = this.subjectScheduleDetailForm.getRawValue();
        console.log(formValue);

        if (this.actionEnum === 'create') {
            let req: SubjectScheduleDetailCreateReq = {
                ...formValue,
                subjectScheduleId: subjectScheduleId,
            };
            this._subjectScheduleService
                .addDetail(subjectScheduleId, req)
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
            let subjectScheduleDetailId = this.subjectScheduleDetail!.subjectScheduleDetailId;

            let req: SubjectScheduleDetailUpdateReq = {
                ...formValue,
                subjectScheduleId: subjectScheduleId,
                subjectScheduleDetailId: subjectScheduleDetailId,
            };
            this._subjectScheduleService
                .updateDetail(subjectScheduleId, subjectScheduleDetailId, req)
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
