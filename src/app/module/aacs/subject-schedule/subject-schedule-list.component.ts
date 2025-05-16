import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { ClassService } from '../../../aacs/service/class/class.service';
import { SemesterService } from '../../../aacs/service/semester/semester.service';
import { SubjectScheduleService } from '../../../aacs/service/subject-schedule/subject-schedule.service';
import { SubjectScheduleRes } from '../../../aacs/service/subject-schedule/types';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';

@Component({
    selector: 'subjectSchedule-list',
    standalone: false,
    templateUrl: './subject-schedule-list.component.html',
})
export class SubjectSchedulesListComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    subjectSchedules: SubjectScheduleRes[] = [];
    classes: CmSelectOption[] = [];
    semesters: CmSelectOption[] = [];
    selectedSubjectSchedules: SubjectScheduleRes[] = [];
    constructor(
        private readonly _subjectScheduleService: SubjectScheduleService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _router: Router,
        private readonly _classService: ClassService,
        private readonly _semesterService: SemesterService,
    ) {}
    filter: {
        textSearch?: string;
        classIds?: string[];
        semesterIds?: string[];
    } = {
        textSearch: undefined,
        classIds: undefined,
        semesterIds: undefined,
    };
    isLoading = false;
    ngOnInit(): void {
        this.getAllSubjectSchedules();
        this.getClasses();
        this.getSemesters();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllSubjectSchedules();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
                this.classes = res.data.map((item) => ({
                    id: item.classId,
                    name: item.className,
                }));
            });
    }
    getSemesters() {
        this._semesterService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.semesters = res.data.map((item) => ({
                    id: item.semesterId,
                    name: item.semesterName,
                }));
            });
    }

    getAllSubjectSchedules() {
        this.isLoading = true;
        this._subjectScheduleService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.subjectSchedules = res.data;
            });
    }
    onDeleteSubjectSchedule(subjectSchedule: SubjectScheduleRes) {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                this._subjectScheduleService.delete(subjectSchedule.subjectScheduleId).subscribe((res) => {
                    if (res.data) {
                        this.getAllSubjectSchedules();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onDeleteRangeSubjectSchedule() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedSubjectSchedules.map((item) => item.subjectScheduleId);
                this._subjectScheduleService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllSubjectSchedules();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddSubjectSchedule() {
        this._router.navigate(['/subject-schedules/create']);
    }
    onEditSubjectSchedule(subjectSchedule: SubjectScheduleRes) {
        this._router.navigate(['/subject-schedules/edit', subjectSchedule.subjectScheduleId]);
    }
    onSearch() {
        this._debounce.next();
    }
    onViewSubjectSchedule(subjectSchedule: SubjectScheduleRes) {
        this._router.navigate(['/subject-schedules/', subjectSchedule.subjectScheduleId]);
    }
}
