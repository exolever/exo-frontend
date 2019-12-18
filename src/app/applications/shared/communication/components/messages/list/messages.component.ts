import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { Conversation } from '@applications/shared/communication/model/communication.model';

enum SCROLL_DIRECTION {
  UP = 'up',
  DOWN = 'down'
}

@Component({
  selector: 'app-conversation-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListMessagesComponent implements OnChanges {

  @Input()
  conversation: Conversation;

  @Input()
  replyingMessage: boolean;

  @Input()
  loading: boolean;

  @Input()
  smallDevices?: boolean;

  @Output()
  submit: EventEmitter<{message: string, files: FilestackUploadInterface[]}> = new EventEmitter();

  @Output()
  scrolled: EventEmitter<string> = new EventEmitter();

  @ViewChild('messages', {static: false})
  elementRef: ElementRef;

  scrollDirection = SCROLL_DIRECTION;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 4;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.conversation && changes.conversation.currentValue
      && ((changes.loading && changes.loading.currentValue === false) || this.smallDevices)) {
      this.manageScroll(changes.conversation.currentValue);
    }

    if (changes.replyingMessage && !changes.replyingMessage.isFirstChange()) {
      setTimeout(() => {
        // See manageScroll() documentation to know why use setTimeout.
        this.scrollToBottom();
      }, 250);
    }
  }

  /**
   * ScrollPosition can be bottom or an ID message item in the list. Im getting the offsetTop from the ID to
   * place the scroll in that position.
   * Need timeout to have the guarantee that the DOM was filled. Can't use the afterviewChecked because
   * infinite-scroll-bar is launching changes all the time.
   * @param conversation
   */
  manageScroll(conversation: Conversation) {
    if (conversation.scrollPosition === 'bottom') {
      setTimeout(() => {
        this.scrollToBottom();
      }, 250);
    }

    if (Number.isInteger(<number>conversation.scrollPosition)) {
      setTimeout(() => {
        this.scrollToElement(conversation);
      }, 250);
    }
  }

  onScrollUp(ev) {
    this.scrolled.emit(this.scrollDirection.UP);
  }

  scrollToElement(conversation: Conversation) {
    if (this.elementRef) {
      const element = this.elementRef.nativeElement.querySelector(
        `[data-id="${conversation.scrollPosition}"]`
      );
      if (element) {
        this.elementRef.nativeElement.scrollTop = element.offsetTop;
      } else {
        this.scrollToBottom();
      }
    }
  }

  scrollToBottom(): void {
    if (this.elementRef) {
      this.elementRef.nativeElement.scrollTop = this.elementRef.nativeElement.scrollHeight;
    }
  }
}
