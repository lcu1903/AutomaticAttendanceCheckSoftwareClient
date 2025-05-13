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
import { StudentService } from '../../../aacs/service/student/students.service';
import { StudentRes } from '../../../aacs/service/student/types';

@Component({
    selector: 'student-list',
    standalone: false,
    templateUrl: './students-list.component.html',
})
export class StudentsListComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    students: StudentRes[] = [];
    departments: CmSelectOption[] = [];
    positions: CmSelectOption[] = [];
    selectedStudents: StudentRes[] = [];
    constructor(
        private readonly _studentService: StudentService,
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
        this.getAllStudents();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllStudents();
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
    getAllStudents() {
        this.isLoading = true;
        this._studentService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.students = res.data;
            });
    }
    onDeleteStudent(student: StudentRes) {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                this._studentService.delete(student.studentId).subscribe((res) => {
                    if (res.data) {
                        this.getAllStudents();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onDeleteRangeStudent() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedStudents.map((item) => item.studentId);
                this._studentService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllStudents();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddStudent() {
        this._router.navigate(['/students/create']);
    }
    onEditStudent(student: StudentRes) {
        this._router.navigate(['/students/edit', student.studentId]);
    }
    onSearch() {
        this._debounce.next();
    }
}
