import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { SubjectScheduleDetailRes, SubjectScheduleRes } from '../../../aacs/service/subject-schedule/types';
import { SubjectScheduleService } from '../../../aacs/service/subject-schedule/subject-schedule.service';
import { TranslocoService } from '@jsverse/transloco';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { SubjectSchedulesDetailCreateEditPopupComponent } from './subject-schedule-detail-create-edit-popup.component';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';

@Component({
    selector: 'subjectSchedule-detail',
    standalone: false,
    templateUrl: './subject-schedule-detail.component.html',
})
export class SubjectSchedulesDetailComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    subjectSchedule: SubjectScheduleRes | null = null;
    subjectScheduleId: string | null = null;
    isLoading: boolean = false;
    selectedTab: string = '0';
    selectedSubjectSchedules: string[] = [];
    constructor(
        private readonly _subjectScheduleService: SubjectScheduleService,
        private readonly _translocoService: TranslocoService,
        private readonly _router: Router,
        private readonly _dialogService: DialogService,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
    ) {
        this._activatedRoute.params.subscribe((params) => {
            this.subjectScheduleId = params['id'];
            if (this.subjectScheduleId) {
                this.getById(this.subjectScheduleId);
            }
        });
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {}
    getById(id: string) {
        this._subjectScheduleService
            .getById(id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.subjectSchedule = res.data;
            });
    }
    onBack() {
        this._router.navigate(['../'], { relativeTo: this._activatedRoute });
    }
    onEdit() {
        this._router.navigate(['../edit', this.subjectScheduleId], { relativeTo: this._activatedRoute });
    }
    onChangeTab(tab: { label: string; route: string }) {
        this.selectedTab = tab.route;
        console.log(tab.route);
    }
    onChangeSubjectSchedule() {}
    onAddScheduleDetail() {
        let ref = this._dialogService.open(SubjectSchedulesDetailCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.editSchedule'),
            modal: true,
            data: {
                subjectScheduleDetail: null,
                subjectSchedule: this.subjectSchedule,
            } as {
                subjectScheduleDetail: SubjectScheduleDetailRes | null;
                subjectSchedule: SubjectScheduleRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getById(this.subjectScheduleId!);
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.updateSuccess');
            }
        });
    }
    onEditSubjectScheduleDetail(subjectScheduleDetail: SubjectScheduleDetailRes) {
        let ref = this._dialogService.open(SubjectSchedulesDetailCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.editSchedule'),
            modal: true,
            data: {
                subjectScheduleDetail: subjectScheduleDetail,
                subjectSchedule: this.subjectSchedule,
            } as {
                subjectScheduleDetail: SubjectScheduleDetailRes | null;
                subjectSchedule: SubjectScheduleRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getById(this.subjectScheduleId!);
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.updateSuccess');
            }
        });
    }
    onDeleteSubjectScheduleDetail(subjectScheduleDetail: SubjectScheduleDetailRes) {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                this._subjectScheduleService.deleteDetail(subjectScheduleDetail.subjectScheduleDetailId, this.subjectScheduleId!).subscribe((res) => {
                    if (res.data) {
                        this.getById(this.subjectScheduleId!);
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
}
