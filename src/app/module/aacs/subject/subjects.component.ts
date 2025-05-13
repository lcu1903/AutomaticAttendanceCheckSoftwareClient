import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { SubjectService } from '../../../aacs/service/subject/subject.service';
import { SubjectRes } from '../../../aacs/service/subject/types';
import { SubjectCreateEditPopupComponent } from './subject-create-edit-popup.component';

@Component({
    selector: 'subjects',
    standalone: false,
    templateUrl: './subjects.component.html',
})
export class SubjectsComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    subjects: SubjectRes[] = [];
    selectedSubject: SubjectRes[] = [];
    constructor(
        private readonly _subjectService: SubjectService,
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
        this.getAllSubject();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllSubject();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllSubject() {
        this.isLoading = true;
        this._subjectService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.subjects = res.data;
            });
    }
    onDeleteSubject() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedSubject.map((item) => item.subjectId);
                this._subjectService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllSubject();
                        this._messagePopupService.show(PopupType.SUCCESS, null, 'common.deleteSuccess');
                    }
                });
            },
            () => {},
        );
    }
    onAddSubject() {
        let ref = this._dialogService.open(SubjectCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.subject'),
            modal: true,
            data: {
                subject: null,
            } as {
                subject: SubjectRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllSubject();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.addSuccess');
            }
        });
    }
    onEditSubject(subjectRoom: SubjectRes) {
        let ref = this._dialogService.open(SubjectCreateEditPopupComponent, {
            header: this._translocoService.translate('aacs.subject'),
            modal: true,
            data: {
                subject: subjectRoom,
            } as {
                subject: SubjectRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllSubject();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.updateSuccess');
            }
        });
    }
    onSearch() {
        this._debounce.next();
    }
}
