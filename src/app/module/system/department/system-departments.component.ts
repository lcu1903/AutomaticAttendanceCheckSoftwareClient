import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { SystemDepartmentRes } from '../../../aacs/service/system-department/types';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';
import { SystemDepartmentsCreateEditPopupComponent } from './system-departments-create-edit-popup.component';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';

@Component({
    selector: 'system-departments',
    standalone: false,
    templateUrl: './system-departments.component.html',
})
export class SystemDepartmentsComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    departments: SystemDepartmentRes[] = [];
    selectedDepartments: SystemDepartmentRes[] = [];
    constructor(
        private readonly _systemDepartmentService: SystemDepartmentService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _dialogService: DialogService,
        private readonly _messagePopupService: MessagePopupService,
    ) {}
    filter: {
        textSearch: string | null;
    } = {
        textSearch: null,
    };
    isLoading = false;
    ngOnInit(): void {
        this.getAllDepartments();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllDepartments();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllDepartments() {
        this.isLoading = true;
        this._systemDepartmentService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.departments = res.data;
            });
    }
    onDeleteDepartment() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedDepartments.map((item) => item.departmentId);
                this._systemDepartmentService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllDepartments();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddDepartment() {
        let ref = this._dialogService.open(SystemDepartmentsCreateEditPopupComponent, {
            header: this._translocoService.translate('system.departments'),
            modal: true,
            data: {
                department: null,
            } as {
                department: SystemDepartmentRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllDepartments();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.addSuccess');
            }
        });
    }
    onEditDepartment(department: SystemDepartmentRes) {
        let ref = this._dialogService.open(SystemDepartmentsCreateEditPopupComponent, {
            header: this._translocoService.translate('system.departments'),
            modal: true,
            data: {
                department: department,
            } as {
                department: SystemDepartmentRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllDepartments();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.updateSuccess');
            }
        });
    }
    onSearch() {
        this._debounce.next();
    }
}
