import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { SystemPositionService } from '../../../aacs/service/system-position/system-position.service';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { SystemDepartmentRes } from '../../../aacs/service/system-department/types';
import { SystemPositionRes } from '../../../aacs/service/system-position/types';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { Router } from '@angular/router';
import { TeacherService } from '../../../aacs/service/teacher/teachers.service';
import { TeacherRes } from '../../../aacs/service/teacher/types';

@Component({
    selector: 'teacher-list',
    standalone: false,
    templateUrl: './teachers-list.component.html',
})
export class TeachersListComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    teachers: TeacherRes[] = [];
    departments: CmSelectOption[] = [];
    positions: CmSelectOption[] = [];
    selectedTeachers: TeacherRes[] = [];
    constructor(
        private readonly _teacherService: TeacherService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _messagePopupService: MessagePopupService,
        private readonly _systemDepartmentService: SystemDepartmentService,
        private readonly _systemPositionService: SystemPositionService,
        private readonly _router: Router,
    ) {}
    filter: {
        textSearch?: string;
        departmentIds?: string[];
        positionIds?: string[];
    } = {
        textSearch: undefined,
        departmentIds: undefined,
        positionIds: undefined,
    };
    isLoading = false;
    ngOnInit(): void {
        this.getAllTeachers();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllTeachers();
        });
        this.getDepartments();
        this.getPositions();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getDepartments() {
        this._systemDepartmentService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.departments = res.data.map((item: SystemDepartmentRes) => {
                    return {
                        id: item.departmentId,
                        name: item.departmentName,
                    };
                });
            });
    }
    getPositions() {
        this._systemPositionService
            .getAll()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.positions = res.data.map((item: SystemPositionRes) => {
                    return {
                        id: item.positionId,
                        name: item.positionName,
                    };
                });
            });
    }
    getAllTeachers() {
        this.isLoading = true;
        this._teacherService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.teachers = res.data;
            });
    }
    onDeleteTeacher(teacher: TeacherRes) {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                this._teacherService.delete(teacher.teacherId).subscribe((res) => {
                    if (res.data) {
                        this.getAllTeachers();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onDeleteRangeTeacher() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedTeachers.map((item) => item.teacherId);
                this._teacherService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllTeachers();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddTeacher() {
        this._router.navigate(['/teachers/create']);
    }
    onEditTeacher(teacher: TeacherRes) {
        this._router.navigate(['/teachers/edit', teacher.teacherId]);
    }
    onSearch() {
        this._debounce.next();
    }
}
