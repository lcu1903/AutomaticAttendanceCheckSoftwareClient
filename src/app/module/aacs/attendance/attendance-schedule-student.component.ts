import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, takeUntil } from 'rxjs';
import { FaceDetectionService } from '../../../aacs/service/face-detection/face-detection.service';
import { MessagePopupService } from '../../../base-components/message-popup/message-popup.component';
import { SubjectScheduleRes } from '../../../aacs/service/subject-schedule/types';
import { SubjectScheduleStudentService } from '../../../aacs/service/subject-schedule-student/subject-schedule-student.service';
import { UserRes } from '../../../aacs/service/users/types';
import { SubjectScheduleStudentRes } from '../../../aacs/service/subject-schedule-student/types';
import { UserService } from '../../../aacs/service/users/users.service';
import { Router } from '@angular/router';
import moment from 'moment';

@Component({
    selector: 'attendance-schedule-student',
    standalone: false,
    templateUrl: './attendance-schedule-student.component.html',
})
export class AttendanceScheduleStudentComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll$: Subject<void> = new Subject<void>();
    currentUser: UserRes | null = null;
    studentId: string | null = null;
    subjectSchedules: SubjectScheduleRes[] = [];
    subjectScheduleStudents: SubjectScheduleStudentRes[] = [];
    constructor(
        private readonly _messagePopupService: MessagePopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _userService: UserService,
        private readonly _subjectScheduleStudentService: SubjectScheduleStudentService,
        private readonly _router: Router,
    ) {}
    ngOnDestroy(): void {
        this._unsubscribeAll$.next();
        this._unsubscribeAll$.complete();
    }
    ngOnInit(): void {
        this.currentUser = this._userService.userInfo;
        if (this.currentUser?.userId) {
            this.studentId = this.currentUser.studentId!;
            this.getAllSchedules(this.studentId);
        }
    }
    getAllSchedules(studentId: string): void {
        this._subjectScheduleStudentService
            .getByStudentId(studentId)
            .pipe(takeUntil(this._unsubscribeAll$))
            .subscribe((res) => {
                // Get current time as HH:mm:ss only
                const now = moment(); // your local time
                const currentTimeOnly = moment(now.format('HH:mm:ss'), 'HH:mm:ss');

                this.subjectScheduleStudents = res.data.map((item) => {
                    // Extract time-only part (converted from UTC to local first)
                    const startTimeOnly = moment.utc(item.startTime).local().format('HH:mm:ss');
                    const endTimeOnly = moment.utc(item.endTime).local().format('HH:mm:ss');

                    // Parse times as today with only HH:mm:ss
                    const start = moment(startTimeOnly, 'HH:mm:ss');
                    const end = moment(endTimeOnly, 'HH:mm:ss');

                    const isCheckable = currentTimeOnly.isBetween(start, end);

                    return {
                        ...item,
                        isCheckable,
                    };
                });
            });
    }
    onClickCheckAttendance(schedule: SubjectScheduleStudentRes): void {
        this._router.navigate(['./attendances/check'], {
            queryParams: { subjectScheduleDetailId: schedule.subjectScheduleDetailId },
        });
    }
}
