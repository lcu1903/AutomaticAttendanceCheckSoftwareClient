import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { ConfirmationService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationPopupService } from './base-components/confirmation-popup/confirmation-popup.component';
import * as faceapi from 'face-api.js';
@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ToastModule, ConfirmDialogModule],
    providers: [ConfirmationService, ConfirmationPopupService, DialogService],
    template: `<router-outlet></router-outlet> <p-toast></p-toast> <p-confirmdialog /> `,
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
        this.preloadFaceApiModels();
    }
    async preloadFaceApiModels() {
        const modelUrl = 'assets/models'; // Hoặc đúng base path nếu deploy subfolder
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl);
    }
}
