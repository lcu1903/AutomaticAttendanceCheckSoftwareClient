import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../aacs/service/users/users.service';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { UserRes } from '../../../aacs/service/users/types';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { SystemPositionService } from '../../../aacs/service/system-position/system-position.service';
import { SystemDepartmentService } from '../../../aacs/service/system-department/system-department.service';
import { SystemDepartmentRes } from '../../../aacs/service/system-department/types';
import { SystemPositionRes } from '../../../aacs/service/system-position/types';
import { CmSelectOption } from '../../../base-components/cm-select/cm-select.component';
import { Router } from '@angular/router';

@Component({
    selector: 'system-user-list',
    standalone: false,
    templateUrl: './users-list.component.html',
})
export class SystemUsersListComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    users: UserRes[] = [];
    departments: CmSelectOption[] = [];
    positions: CmSelectOption[] = [];
    selectedUsers: UserRes[] = [];
    constructor(
        private readonly _systemUserService: UserService,
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
        this.getAllUsers();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllUsers();
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
    getAllUsers() {
        this.isLoading = true;
        this._systemUserService
            .getAllUsers(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.users = res.data;
            });
    }
    onDeleteUser(user: UserRes) {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                this._systemUserService.deleteUser(user.userId).subscribe((res) => {
                    if (res.data) {
                        this.getAllUsers();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onDeleteRangeUser() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedUsers.map((item) => item.userId);
                this._systemUserService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllUsers();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddUser() {
        this._router.navigate(['/users/create']);
    }
    onEditUser(user: UserRes) {
        this._router.navigate(['/users/edit', user.userId]);
    }
    onSearch() {
        this._debounce.next();
    }
}
