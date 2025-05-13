import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagePopupService } from './base-components/message-popup/message-popup.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationPopupService } from './base-components/confirmation-popup/confirmation-popup.component';
import { DialogService } from 'primeng/dynamicdialog';
import { PrimeNG } from 'primeng/config';
import { TranslocoService } from '@jsverse/transloco';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
    providers: [ConfirmationService, ConfirmationPopupService, DialogService],
    template: `<router-outlet></router-outlet> <p-toast></p-toast> <p-confirmdialog />`,
})
export class AppComponent implements OnInit {
    constructor(
        private config: PrimeNG,
        private translocoService: TranslocoService,
    ) {}

    ngOnInit() {
        this.translocoService.setDefaultLang('vi');
        this.translocoService.selectTranslateObject('viLocale').subscribe((res) => {
            this.config.setTranslation(res);
        });
    }
}
