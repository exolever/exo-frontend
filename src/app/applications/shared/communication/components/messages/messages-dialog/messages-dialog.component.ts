import { Component, Inject } from '@angular/core';
import { OverlayReference } from '@overlay/overlay-ref';
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import { DATA } from '@overlay/services/overlay.service';
import * as selectorsCommunication from '@applications/shared/communication/store/selectors/communication.selectors';
import * as actionCommunication from '@applications/shared/communication/store/action/communication.action';
import { FilestackUploadInterface } from '@core/interfaces/filestack-upload.interface';
import { Conversation } from '@applications/shared/communication/model/communication.model';

@Component({
  templateUrl: './messages-dialog.component.html'
})
export class MessagesDialogComponent {

  conversation$ = this.store.pipe(select(selectorsCommunication.getSelectConversation));

  constructor(
    private overlayRef: OverlayReference,
    private store: Store<AppState>,
    // Data must have an entity property that conversation belong. Could be an opportunity, a project...
    @Inject(DATA) public data: any
  ) { }

  submit(value: {message: string, files: FilestackUploadInterface[]}, conversation: Conversation) {
    this.store.dispatch(new actionCommunication.ConversationReply(
      { uuid: this.data.entity.uuid, id: conversation.id, data: { message: value.message, files: value.files }}
    ));
  }

  close() {
    this.store.dispatch(new actionCommunication.ConversationSelected(undefined));
    this.overlayRef.close(false);
  }

}
