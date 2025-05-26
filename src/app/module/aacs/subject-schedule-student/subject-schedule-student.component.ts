import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Subject, takeUntil } from 'rxjs';
import { SubjectScheduleRes } from '../../../aacs/service/subject-schedule/types';
import { UserService } from '../../../aacs/service/users/users.service';
import { StudentRes } from '../../../aacs/service/student/types';
import { StudentService } from '../../../aacs/service/student/students.service';
import { UserRes } from '../../../aacs/service/users/types';
import { SubjectScheduleService } from '../../../aacs/service/subject-schedule/subject-schedule.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { SemesterService } from '../../../aacs/service/semester/semester.service';
import { ClassService } from '../../../aacs/service/class/class.service';
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
    constructor(
        private readonly _userService: UserService,
        private readonly _studentService: StudentService,
        private readonly _subjectScheduleService: SubjectScheduleService,
        private readonly _semesterService: SemesterService,
        private readonly _classService: ClassService,
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
            });
    }
}
