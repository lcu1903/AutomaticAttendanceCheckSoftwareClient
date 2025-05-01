import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserService } from '../../../aacs/service/users/users.service';

@Component({
    selector: 'system-user-list',
    standalone: false,
    templateUrl: './users-list.component.html',
})
export class SystemUsersListComponent implements OnDestroy, OnInit {
    private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
    constructor(
        private readonly _userService: UserService,
    ) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
