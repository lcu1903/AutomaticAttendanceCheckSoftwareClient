import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagePopupService } from './base-components/message-popup/message-popup.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationPopupService } from './base-components/confirmation-popup/confirmation-popup.component';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
    providers: [MessagePopupService, MessageService, ConfirmationService, ConfirmationPopupService],
    template: `<router-outlet></router-outlet> <p-toast></p-toast> <p-confirmdialog />`,
})
export class AppComponent {}
