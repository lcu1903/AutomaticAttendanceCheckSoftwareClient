import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { SemesterService } from '../../../aacs/service/semester/semester.service';
import { SemesterRes } from '../../../aacs/service/semester/types';
import { SemesterCreateEditPopupComponent } from './semester-create-edit-popup.component';

@Component({
    selector: 'semesteres',
    standalone: false,
    templateUrl: './semesters.component.html',
})
export class SemestersComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    semesters: SemesterRes[] = [];
    selectedSemester: SemesterRes[] = [];
    constructor(
        private readonly _semesterService: SemesterService,
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
        this.getAllSemester();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllSemester();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllSemester() {
        this.isLoading = true;
        this._semesterService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.semesters = res.data;
            });
    }
    onDeleteSemester() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedSemester.map((item) => item.semesterId);
                this._semesterService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllSemester();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddSemester() {
        let ref = this._dialogService.open(SemesterCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.semester'),
            modal: true,
            data: {
                semester: null,
            } as {
                semester: SemesterRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllSemester();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.addSuccess');
            }
        });
    }
    onEditSemester(semesterRoom: SemesterRes) {
        let ref = this._dialogService.open(SemesterCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.semester'),
            modal: true,
            data: {
                semester: semesterRoom,
            } as {
                semester: SemesterRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllSemester();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.updateSuccess');
            }
        });
    }
    onSearch() {
        this._debounce.next();
    }
}
