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
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { StudentService } from '../../../aacs/service/student/students.service';
import { ClassService } from '../../../aacs/service/class/class.service';
import { SubjectScheduleStudentCreateReq } from '../../../aacs/service/subject-schedule-student/types';
import { SubjectScheduleStudentService } from '../../../aacs/service/subject-schedule-student/subject-schedule-student.service';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';

@Component({
    selector: 'subject-schedule-add-student-popup',
    standalone: false,
    templateUrl: './subject-schedule-add-student-popup.component.html',
})
export class SubjectSchedulesAddStudentPopupComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    instance: DynamicDialogComponent | undefined;
    subjectScheduleId: string | null = null;
    isLoading: boolean = false;
    selectedClassId: string | null = null;
    students: CmSelectOption[] = [];
    classes: CmSelectOption[] = [];
    studentRegisterSchema: z.ZodSchema<SubjectScheduleStudentCreateReq> = z.object({
        studentId: z.string().min(1, 'system.error.required'),
        subjectScheduleId: z.string().min(1, 'system.error.required'),
        classId: z.string().min(1, 'system.error.required'),
    });
    studentRegisterForm!: FormGroup;
    constructor(
        private ref: DynamicDialogRef,
        private dialogService: DialogService,
        private readonly _translocoService: TranslocoService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _studentService: StudentService,
        private readonly _classService: ClassService,
        private readonly _formBuilder: FormBuilder,
        private readonly _subjectScheduleStudentService: SubjectScheduleStudentService,
        private readonly _messagePopupService: MessagePopupService,
    ) {
        this.instance = this.dialogService.getInstance(this.ref);
        const data = this.instance?.data as { subjectScheduleId: string | null; classId: string | null };
        if (data) {
            this.subjectScheduleId = data.subjectScheduleId;
            this.selectedClassId = data.classId;
        }
    }
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    ngOnInit(): void {
        this.getClasses();
        this.studentRegisterForm = this._formBuilder.group({
            studentId: [null],
            classId: [this.selectedClassId],
            subjectScheduleId: [this.subjectScheduleId],
        });
        this.getStudents();
    }
    getClasses() {
        this._classService.getAll().subscribe((res) => {
            this.classes = res.data.map((item) => ({
                id: item.classId,
                name: item.className ?? '',
            }));
        });
    }
    onSave() {
        if (this.studentRegisterForm.valid) {
            this.isLoading = true;
            const req: SubjectScheduleStudentCreateReq = {
                studentId: this.studentRegisterForm.get('studentId')?.value,
                subjectScheduleId: this.subjectScheduleId ?? '',
            };
            this._subjectScheduleStudentService
                .create([req])
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    }),
                )
                .subscribe((res) => {
                    if (res.success) {
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.addSuccess');
                        this.ref.close(true);
                        return;
                    }
                });
        }
    }
    getStudents() {
        if (this.selectedClassId !== null) {
            this._studentService.getAll({ classIds: [this.selectedClassId] }).subscribe((res) => {
                this.students = res.data.map((item) => ({
                    name: item.user?.fullName ?? '',
                    id: item.studentId,
                }));
            });
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
