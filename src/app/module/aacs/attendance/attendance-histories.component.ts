import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { SubjectScheduleStudentService } from '../../../aacs/service/subject-schedule-student/subject-schedule-student.service';
import { UserService } from '../../../aacs/service/users/users.service';
import { MessagePopupService } from '../../../base-components/message-popup/message-popup.component';
import { UserRes } from '../../../aacs/service/users/types';
import { AttendanceService } from '../../../aacs/service/attendance/attendance.service';
import { AttendanceHistoryStudentDetailRes, AttendanceHistoryStudentRes } from '../../../aacs/service/attendance/types';
import moment from 'moment';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';

@Component({
    selector: 'attendance-histories',
    standalone: false,
    templateUrl: './attendance-histories.component.html',
})
export class AttendanceHistoriesComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll$: Subject<void> = new Subject<void>();
    private readonly _debounce = new Subject<void>();
    currentUser: UserRes | null = null;
    filters: {
        userId?: string;
        subjectId?: string;
        semesterId?: string;
    } = {
        userId: undefined,
        subjectId: undefined,
        semesterId: undefined,
    };
    subjects: CmSelectOption[] = [];
    res: AttendanceHistoryStudentRes[] = [];
    expandedRowKeys: { [key: string]: boolean } = {};
    totalAttendance: number = 0;
    totalAbsent: number = 0;
    totalSchedule: number = 0;
    isLoading = false;
    constructor(
        private readonly _messagePopupService: MessagePopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _userService: UserService,
        private readonly _subjectScheduleStudentService: SubjectScheduleStudentService,
        private readonly _router: Router,
        private readonly _attendanceService: AttendanceService,
    ) {
        this.currentUser = this._userService.userInfo;
        if (this.currentUser?.userId) {
            this.filters.userId = this.currentUser.userId;
        }
    }
    ngOnDestroy(): void {
        this._unsubscribeAll$.next();
        this._unsubscribeAll$.complete();
    }
    ngOnInit(): void {
        this.getAttendanceHistories();
        this.getRegisteredSubjects();
        this._debounce.pipe(takeUntil(this._unsubscribeAll$), debounceTime(300)).subscribe((value) => {
            this.getAttendanceHistories();
        });
    }
    onSearch(): void {
        this._debounce.next();
    }
    getAttendanceHistories(): void {
        this.isLoading = true;
        this._attendanceService
            .getAttendanceHistoriesByUserId(this.filters)
            .pipe(
                takeUntil(this._unsubscribeAll$),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.res = res.data;
                this.totalAttendance = res.data.reduce((acc, item) => acc + item.attendanceDetails.filter((e) => e.attendanceTime != null).length, 0);
                this.totalAbsent = res.data.reduce((acc, item) => acc + item.attendanceDetails.filter((e) => e.attendanceTime == null).length, 0);
                this.totalSchedule = res.data.reduce((acc, item) => acc + item.attendanceDetails.length, 0);
            });
    }
    onRowExpand(event: any): void {
        console.log('Row expanded:', event.data);

        this.expandedRowKeys[event.data.subjectCode] = true;
    }

    onRowCollapse(event: any): void {
        delete this.expandedRowKeys[event.data.subjectCode];
    }
    getStatusName(detail: AttendanceHistoryStudentDetailRes): string {
        if (!detail.statusId) {
            if (detail.startTime && detail.endTime && !detail.attendanceTime && moment().isAfter(moment(detail.scheduleDate))) {
                return this._translocoService.translate('aacs.attendanceAbsent');
            }
        } else {
            if (detail.statusId === 'LATE') {
                return this._translocoService.translate('aacs.late');
            }
        }

        return '';
    }
    getRegisteredSubjects() {
        this._subjectScheduleStudentService.getAll({ studentIds: [this.currentUser?.studentId!] }).subscribe((res) => {
            this.subjects = res.data.map((item) => {
                return {
                    id: item.subjectId,
                    name: item.subjectName ?? '',
                };
            });
        });
    }
}
