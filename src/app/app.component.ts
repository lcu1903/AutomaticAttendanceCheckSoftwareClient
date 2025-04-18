import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessagePopupService } from './base-components/message-popup/message-popup.component';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  providers: [MessagePopupService, MessageService],
  template: `<router-outlet></router-outlet> <p-toast></p-toast>`,
})
export class AppComponent {
}
