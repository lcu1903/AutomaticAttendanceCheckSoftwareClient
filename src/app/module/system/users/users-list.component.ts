import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../aacs/service/users/users.service';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { UserRes } from '../../../aacs/service/users/types';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';

@Component({
    selector: 'system-user-list',
    standalone: false,
    templateUrl: './users-list.component.html',
})
export class SystemUsersListComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    users: UserRes[] = [];
    selectedUsers: UserRes[] = [];
    constructor(
        private readonly _systemUserService: UserService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _messagePopupService: MessagePopupService,
    ) {}
    filter: {
        textSearch: string | null;
    } = {
        textSearch: null,
    };
    isLoading = false;
    ngOnInit(): void {
        this.getAllUsers();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllUsers();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllUsers() {
        this.isLoading = true;
        this._systemUserService
            .getAllUsers()
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
    onDeleteUser() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedUsers.map((item) => item.userId);
                // this._systemUserService.deleteRange(selectedIds).subscribe((res) => {
                //     if (res.data) {
                //         this.getAllUsers();
                //         this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                //     }
                // });
            },
            () => {},
        );
    }
    onAddUser() {}
    onEditUser(user: UserRes) {}
    onSearch() {
        this._debounce.next();
    }
}
