import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { ClassService } from '../../../aacs/service/class/class.service';
import { ClassRes } from '../../../aacs/service/class/types';
import { ClassCreateEditPopupComponent } from './classes-create-edit-popup.component';

@Component({
    selector: 'classes',
    standalone: false,
    templateUrl: './classes.component.html',
})
export class ClassesComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    class: ClassRes[] = [];
    selectedClass: ClassRes[] = [];
    constructor(
        private readonly _classService: ClassService,
        private readonly _confirmationPopupService: ConfirmationPopupService,
        private readonly _translocoService: TranslocoService,
        private readonly _dialogService: DialogService,
        private readonly _messagePopupService: MessagePopupService,
    ) {}
    filter: {
        textSearch?: string;
    } = {
        textSearch: undefined,
    };
    isLoading = false;
    ngOnInit(): void {
        this.getAllClass();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllClass();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllClass() {
        this.isLoading = true;
        this._classService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.class = res.data;
            });
    }
    onDeleteClass() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedClass.map((item) => item.classId);
                this._classService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllClass();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddClass() {
        let ref = this._dialogService.open(ClassCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.studentClass'),
            modal: true,
            data: {
                class: null,
            } as {
                class: ClassRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllClass();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.addSuccess');
            }
        });
    }
    onEditClass(classRoom: ClassRes) {
        let ref = this._dialogService.open(ClassCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.studentClass'),
            modal: true,
            data: {
                class: classRoom,
            } as {
                class: ClassRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllClass();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.updateSuccess');
            }
        });
    }
    onSearch() {
        this._debounce.next();
    }
}
