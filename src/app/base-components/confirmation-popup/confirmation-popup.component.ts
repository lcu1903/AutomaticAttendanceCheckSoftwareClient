import { Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService, MessageService } from 'primeng/api';
@Injectable({ providedIn: 'root' })
export class ConfirmationPopupService {
    constructor(
        private confirmationService: ConfirmationService,
        private translocoService: TranslocoService,
    ) {}

    showConfirm(title?: string | null, content?: string, acceptFunction?: () => void, rejectFunction?: () => void): void {
        this.confirmationService.confirm({
            header: title || this.translocoService.translate('common.title'),
            message: content || '',
            rejectButtonProps: {
                label: this.translocoService.translate('common.cancel'),
                outlined: true,
            },
            acceptButtonProps: {
                label: this.translocoService.translate('common.confirm'),
            },
            accept: () => {
                if (acceptFunction) {
                    acceptFunction();
                }
            },
            reject: () => {
                if (rejectFunction) {
                    rejectFunction();
                }
            },
        });
    }
}
