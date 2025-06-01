import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { ClassService } from '../../../aacs/service/class/class.service';
import { SemesterService } from '../../../aacs/service/semester/semester.service';
import { StudentService } from '../../../aacs/service/student/students.service';
import { StudentRes } from '../../../aacs/service/student/types';
import { SubjectScheduleService } from '../../../aacs/service/subject-schedule/subject-schedule.service';
import { SubjectScheduleRes } from '../../../aacs/service/subject-schedule/types';
import { UserRes } from '../../../aacs/service/users/types';
import { UserService } from '../../../aacs/service/users/users.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { SubjectScheduleStudentService } from '../../../aacs/service/subject-schedule-student/subject-schedule-student.service';
import { SubjectScheduleStudentCreateReq, SubjectScheduleStudentRes } from '../../../aacs/service/subject-schedule-student/types';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
@Component({
    selector: 'subject-schedule-student',
    standalone: false,
    templateUrl: './subject-schedule-student.component.html',
})
export class SubjectScheduleStudentsComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    subjectSchedules: SubjectScheduleRes[] = [];
    semesters: CmSelectOption[] = [];
    classes: CmSelectOption[] = [];
    subjectScheduleId: string | null = null;
    currentStudent: StudentRes | null = null;
    currentUser: UserRes | null = null;
    isLoading: boolean = false;
    classId: string | null = null;
    semesterId: string | null = null;
    visible: boolean = false;
    scheduleIdCalendar: string | null = null;
    setOfCheckedSchedules: string[] = [];
    setOfRegisteredSchedules: string[] = [];
    registeredSchedule: SubjectScheduleStudentRes[] = [];
    showRegisteredSchedules: boolean = false;
    selectedSchedules: SubjectScheduleRes[] = [];
    constructor(
        private readonly _userService: UserService,
        private readonly _studentService: StudentService,
        private readonly _subjectScheduleService: SubjectScheduleService,
        private readonly _subjectScheduleStudentService: SubjectScheduleStudentService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _semesterService: SemesterService,
        private readonly _classService: ClassService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
    ) {}
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this.currentUser = this._userService.userInfo;
        console.log(this.currentUser);

        if (this.currentUser?.userId) {
            this.getStudentByUserId(this.currentUser?.userId);
            this.classId = this.currentUser?.classId ?? null;
        }
        this.getClasses();
        this.getSemesters();
    }
    getClasses() {
        this._classService
            .getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.classes = res.data.map((item) => ({
                    name: item.className ?? '',
                    id: item.classId,
                }));
            });
    }
    getSemesters() {
        this._semesterService
            .getAll()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.semesters = res.data.map((item) => ({
                    name: item.semesterName ?? '',
                    id: item.semesterId,
                }));
                this.semesterId = res.data[0]?.semesterId ?? null;
            });
    }
    getStudentByUserId(userId: string) {
        this._studentService
            .getStudentByUserId(userId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.currentStudent = res.data;
            });
    }
    getSchedule() {
        if (!this.classId || !this.semesterId) {
            return;
        }
        this.setOfCheckedSchedules = [];
        this._subjectScheduleService
            .getAll({ classIds: [this.classId ?? ''], semesterIds: [this.semesterId ?? ''] })
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.subjectSchedules = res.data;
                this.getRegisteredSchedules();
            });
    }
    onShowSchedule(scheduleId: string) {
        this.visible = !this.visible;
        this.scheduleIdCalendar = scheduleId;
    }
    onRegisterSchedules() {
        let selectedScheduleNames = this.subjectSchedules
            .filter((schedule) => this.setOfCheckedSchedules.includes(schedule.subjectScheduleId))
            .map((schedule) => schedule.subjectName)
            .join('<br>- ');

        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.confirm'),
            this._translocoService.translate('aacs.confirmRegisterSubject') + ': <br>- ' + selectedScheduleNames,
            () => {
                let req: SubjectScheduleStudentCreateReq[] = this.setOfCheckedSchedules.map((scheduleId) => {
                    return {
                        studentId: this.currentUser?.studentId!,
                        subjectScheduleId: scheduleId,
                    };
                });
                this._subjectScheduleStudentService
                    .create(req)
                    .pipe(
                        takeUntil(this._unsubscribeAll),
                        finalize(() => {
                            this.visible = false;
                            this.setOfCheckedSchedules = [];
                        }),
                    )
                    .subscribe((res) => {
                        if (res.success) {
                            this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                            this.getSchedule();
                        }
                    });
            },
            () => {},
        );
    }
    getRegisteredSchedules() {
        if (!this.currentUser?.studentId) {
            return;
        }
        this._subjectScheduleStudentService
            .getByStudentId(this.currentUser?.studentId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((res) => {
                this.registeredSchedule = res.data;
                // this.setOfCheckedSchedules = this.registeredSchedule.map((item) => item.subjectScheduleId);
                this.setOfRegisteredSchedules = this.registeredSchedule.map((item) => item.subjectScheduleId);
                this.selectedSchedules = this.subjectSchedules.filter((schedule) =>
                    this.setOfRegisteredSchedules.includes(schedule.subjectScheduleId),
                );
            });
    }
    onCheckSchedule(scheduleId: string) {
        if (!this.setOfCheckedSchedules.includes(scheduleId)) {
            this.selectedSchedules.push(this.subjectSchedules.find((schedule) => schedule.subjectScheduleId === scheduleId)!);
        } else {
            this.selectedSchedules = this.selectedSchedules.filter((schedule) => schedule.subjectScheduleId !== scheduleId);
        }
    }
    onShowRegisteredSchedules() {
        this.setOfCheckedSchedules = [];
    }
}
