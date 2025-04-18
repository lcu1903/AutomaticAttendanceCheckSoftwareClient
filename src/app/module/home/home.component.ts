import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { MessagePopupService, PopupType } from '../../base-components/message-popup/message-popup.component';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  standalone: true,
})
export class HomeComponent {
  private readonly _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private readonly _messageService: MessagePopupService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }
}
