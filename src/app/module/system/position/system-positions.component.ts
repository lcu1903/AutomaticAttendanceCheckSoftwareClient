import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject, takeUntil } from 'rxjs';
import { SystemPositionService } from '../../../aacs/service/system-position/system-position.service';
import { SystemPositionRes } from '../../../aacs/service/system-position/types';
import { ConfirmationPopupService } from '../../../base-components/confirmation-popup/confirmation-popup.component';
import { TranslocoService } from '@jsverse/transloco';
import { DialogService } from 'primeng/dynamicdialog';
import { MessagePopupService, PopupType } from '../../../base-components/message-popup/message-popup.component';
import { SystemPositionsCreateEditPopupComponent } from './system-positions-create-edit-popup.component';

@Component({
    selector: 'system-positions',
    standalone: false,
    templateUrl: './system-positions.component.html',
})
export class SystemPositionsComponent implements OnInit, OnDestroy {
    private readonly _unsubscribeAll = new Subject<any>();
    private readonly _debounce = new Subject<void>();
    positions: SystemPositionRes[] = [];
    selectedPositions: SystemPositionRes[] = [];
    constructor(
        private readonly _systemPositionService: SystemPositionService,
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
        this.getAllPositions();
        this._debounce.pipe(takeUntil(this._unsubscribeAll), debounceTime(300)).subscribe((value) => {
            this.getAllPositions();
        });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    getAllPositions() {
        this.isLoading = true;
        this._systemPositionService
            .getAll(this.filter)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                }),
            )
            .subscribe((res) => {
                this.positions = res.data;
            });
    }
    onDeletePosition() {
        this._confirmationPopupService.showConfirm(
            this._translocoService.translate('common.delete'),
            this._translocoService.translate('common.confirmDelete'),
            () => {
                let selectedIds = this.selectedPositions.map((item) => item.positionId);
                this._systemPositionService.deleteRange(selectedIds).subscribe((res) => {
                    if (res.data) {
                        this.getAllPositions();
                    }
                });
            },
            () => {},
        );
    }
    onAddPosition() {
        let ref = this._dialogService.open(SystemPositionsCreateEditPopupComponent, {
            header: this._translocoService.translate('system.positions'),
            modal: true,
            data: {
                position: null,
            } as {
                position: SystemPositionRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllPositions();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.addSuccess');
            }
        });
    }
    onEditPosition(position: SystemPositionRes) {
        let ref = this._dialogService.open(SystemPositionsCreateEditPopupComponent, {
            header: this._translocoService.translate('system.positions'),
            modal: true,
            data: {
                position: position,
            } as {
                position: SystemPositionRes | null;
            },
        });
        ref.onClose.subscribe((res) => {
            if (res) {
                this.getAllPositions();
                this._messagePopupService.show(PopupType.SUCCESS, null, 'common.updateSuccess');
            }
        });
    }
    onSearch() {
        this._debounce.next();
    }
}
