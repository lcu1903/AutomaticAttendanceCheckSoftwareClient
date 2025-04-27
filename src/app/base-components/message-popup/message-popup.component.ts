import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TranslocoService } from '@jsverse/transloco';
export enum PopupType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARN = 'warn',
}

@Injectable({ providedIn: 'root' })
export class MessagePopupService {
    constructor(
        private messageService: MessageService,
        private translocoService: TranslocoService,
    ) {}

    show(type: PopupType, title?: string | null, content?: string) {
        this.messageService.add({
            severity: type,
            summary: this.translocoService.translate(title ?? 'system.message.success'),
            detail: this.translocoService.translate(content ?? '1'),
            life: 2000,
        });
    }
}
