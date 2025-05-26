import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import moment from 'moment';
import { finalize, Subject, takeUntil } from 'rxjs';
import { z } from 'zod';
import { ClassService } from '../../../aacs/service/class/class.service';
import { SemesterService } from '../../../aacs/service/semester/semester.service';
import { SubjectScheduleService } from '../../../aacs/service/subject-schedule/subject-schedule.service';
import { SubjectScheduleCreateReq, SubjectScheduleRes, SubjectScheduleUpdateReq } from '../../../aacs/service/subject-schedule/types';
import { SubjectService } from '../../../aacs/service/subject/subject.service';
import { TeacherService } from '../../../aacs/service/teacher/teachers.service';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { trimFormValues } from '../../../utils/app.utils';
import { zodValidator } from '../../../utils/validation.utils';
export interface UploadEvent {
    originalEvent: Event;
    files: File[];
}
@Component({
    selector: 'subjectSchedule-create-edit',
    standalone: false,
    templateUrl: './subject-schedule-create-edit.component.html',
})
export class SubjectSchedulesCreateEditComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    subjectSchedule: SubjectScheduleRes | null = null;
    classes: CmSelectOption[] = [];
    teachers: CmSelectOption[] = [];
    subjects: CmSelectOption[] = [];
    semesters: CmSelectOption[] = [];
    isLoading = false;
    subjectScheduleId: string | null = null;
    action: 'create' | 'edit' = 'create';
    constructor(
        private readonly _subjectScheduleService: SubjectScheduleService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _router: Router,
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _formBuilder: FormBuilder,
        private readonly _classService: ClassService,
        private readonly _subjectService: SubjectService,
        private readonly _semesterService: SemesterService,
        private readonly _teacherService: TeacherService,
    ) {
        this._activatedRoute.params.subscribe((params) => {
            this.subjectScheduleId = params['id'];
            if (this.subjectScheduleId) {
                this.action = 'edit';
                this.getSubjectScheduleById(this.subjectScheduleId);
            } else {
                this.action = 'create';
            }
        });
    }
    subjectScheduleSchema: z.ZodSchema<SubjectScheduleCreateReq> = z.object({
        subjectScheduleCode: z.string().min(1, 'system.error.required'),
        semesterId: z.string().min(1, 'system.error.required'),
    });
    subjectScheduleForm!: FormGroup;
    ngOnInit(): void {
        this.getClasses();
        this.getSemesters();
        this.getTeachers();
        this.getSubjects();
        this.subjectScheduleForm = this._formBuilder.group(
            {
                subjectScheduleCode: this.subjectSchedule?.subjectScheduleCode || '',
                semesterId: this.subjectSchedule?.semesterId || '',
                classId: this.subjectSchedule?.classId,
                subjectId: this.subjectSchedule?.subjectId,
                teacherId: this.subjectSchedule?.teacherId,
                teachingAssistant: this.subjectSchedule?.teachingAssistant,
                roomNumber: this.subjectSchedule?.roomNumber,
                startDate: this.subjectSchedule?.startDate ? moment(this.subjectSchedule?.startDate).toDate() : null,
                endDate: this.subjectSchedule?.endDate ? moment(this.subjectSchedule?.endDate).toDate() : null,
                note: this.subjectSchedule?.note,
            },
            {
                validators: zodValidator(this.subjectScheduleSchema),
            },
        );
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getSubjectScheduleById(subjectScheduleId: string) {
        this.isLoading = true;
        this._subjectScheduleService
            .getById(subjectScheduleId)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.subjectSchedule = res.data;
                this.subjectScheduleForm.patchValue({
                    subjectScheduleCode: this.subjectSchedule?.subjectScheduleCode,
                    semesterId: this.subjectSchedule?.semesterId,
                    classId: this.subjectSchedule?.classId,
                    subjectId: this.subjectSchedule?.subjectId,
                    teacherId: this.subjectSchedule?.teacherId,
                    teachingAssistant: this.subjectSchedule?.teachingAssistant,
                    roomNumber: this.subjectSchedule?.roomNumber,
                    startDate: this.subjectSchedule?.startDate ? moment(this.subjectSchedule?.startDate).toDate() : null,
                    endDate: this.subjectSchedule?.endDate ? moment(this.subjectSchedule?.endDate).toDate() : null,
                    note: this.subjectSchedule?.note,
                });
            });
    }

    onBack() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.message.unsavedChanges'),
            this._translocoService.translate('common.message.unsavedChangesConfirm'),
            () => {
                if (this.action === 'edit') {
                    this._router.navigate(['/subject-schedules/', this.subjectScheduleId]);
                } else {
                    this._router.navigate(['/subject-schedules']);
                }
            },
            () => {},
        );
    }
    onSave() {
        if (this.subjectScheduleForm.value.startDate && this.subjectScheduleForm.value.endDate) {
            if (moment(this.subjectScheduleForm.value.startDate).isAfter(moment(this.subjectScheduleForm.value.endDate))) {
                this._messagePopupService.show(PopupType.ERROR, 'ERROR', 'common.message.startDateMustLessThanEndDate');
                return;
            }
        }
        if (this.subjectScheduleForm.invalid) {
            this.subjectScheduleForm.markAllAsTouched();
            return;
        }
        this.subjectScheduleForm.patchValue({
            ...trimFormValues(this.subjectScheduleForm.value),
        });

        if (this.action === 'create') {
            let subjectSchedule: SubjectScheduleCreateReq = {
                subjectScheduleCode: this.subjectScheduleForm.value.subjectScheduleCode,
                semesterId: this.subjectScheduleForm.value.semesterId,
                classId: this.subjectScheduleForm.value.classId,
                subjectId: this.subjectScheduleForm.value.subjectId,
                teacherId: this.subjectScheduleForm.value.teacherId,
                teachingAssistant: this.subjectScheduleForm.value.teachingAssistant,
                roomNumber: this.subjectScheduleForm.value.roomNumber,
                startDate: this.subjectScheduleForm.value.startDate,
                endDate: this.subjectScheduleForm.value.endDate,
                note: this.subjectScheduleForm.value.note,
            };
            this._subjectScheduleService.create(subjectSchedule).subscribe((res) => {
                if (res.data) {
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                    this._router.navigate(['/subject-schedules', res.data.subjectScheduleId]);
                }
            });
        } else {
            let subjectSchedule: SubjectScheduleUpdateReq = {
                subjectScheduleId: this.subjectScheduleId!,
                subjectScheduleCode: this.subjectScheduleForm.value.subjectScheduleCode,
                semesterId: this.subjectScheduleForm.value.semesterId,
                classId: this.subjectScheduleForm.value.classId,
                subjectId: this.subjectScheduleForm.value.subjectId,
                teacherId: this.subjectScheduleForm.value.teacherId,
                teachingAssistant: this.subjectScheduleForm.value.teachingAssistant,
                roomNumber: this.subjectScheduleForm.value.roomNumber,
                startDate: this.subjectScheduleForm.value.startDate,
                endDate: this.subjectScheduleForm.value.endDate,
                note: this.subjectScheduleForm.value.note,
            };
            this._subjectScheduleService.update(this.subjectScheduleId!, subjectSchedule).subscribe((res) => {
                if (res.data) {
                    this._messagePopupService.show(PopupType.SUCCESS, null, 'common.saveSuccess');
                    this._router.navigate(['/subject-schedules', res.data.subjectScheduleId]);
                }
            });
        }
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
                this.classes = res.data.map((item) => {
                    return {
                        id: item.classId,
                        name: item.className,
                    };
                });
            });
    }
    getTeachers() {
        this._teacherService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.teachers = res.data.map((item) => {
                    return {
                        id: item.teacherId,
                        name: item.user?.fullName ?? '',
                    };
                });
            });
    }
    getSubjects() {
        this._subjectService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.subjects = res.data.map((item) => {
                    return {
                        id: item.subjectId,
                        name: item.subjectName ?? '',
                    };
                });
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
                this.semesters = res.data.map((item) => {
                    return {
                        id: item.semesterId,
                        name: item.semesterName,
                    };
                });
            });
    }
}
