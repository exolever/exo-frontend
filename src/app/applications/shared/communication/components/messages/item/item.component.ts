import { Component, Input } from '@angular/core';
import { MessageConversation } from '@applications/shared/communication/model/communication.model';

@Component({
  selector: 'app-conversation-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {

  @Input()
  message: MessageConversation;

  direction(isYour: boolean) {
    return isYour ? 'row-reverse' : 'row';
  }

}
