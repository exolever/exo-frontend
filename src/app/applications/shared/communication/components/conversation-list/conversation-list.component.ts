import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Conversation } from '@applications/shared/communication/model/communication.model';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationListComponent implements OnInit {

  @Input()
  conversations: Conversation[];

  @Input()
  selected: Conversation;

  @Input()
  smallDevices: boolean;

  @Input()
  navToConversation?: number;

  @Output()
  selectConversation: EventEmitter<Conversation> = new EventEmitter<Conversation>();

  ngOnInit(): void {
    if (!this.smallDevices) {
      if (this.navToConversation) {
        const conversation = this.conversations.filter((conv: Conversation) => {
          return conv.id === this.navToConversation;
        });
        this.selectConversation.emit(conversation[0]);
      } else {
        this.selectConversation.emit(this.conversations[0]);
      }
    }
  }

  onSelect(conversation: Conversation) {
    if (!this.smallDevices) {
      if (conversation.id !== this.selected.id) {
        this.selectConversation.emit(conversation);
      } else {
        const messagesDiv = document.getElementById('messages');
        if (messagesDiv) {
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
      }
    } else {
      this.selectConversation.emit(conversation);
    }
  }

  showSelected(conversation: Conversation) {
    return this.selected && conversation.id === this.selected.id && !this.smallDevices;
  }

}
