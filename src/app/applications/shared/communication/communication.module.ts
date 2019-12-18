import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  ConversationListComponent
} from '@applications/shared/communication/components/conversation-list/conversation-list.component';
import { SharedModule } from '@shared/shared.module';
import { OverlayModule } from '@overlay/overlay.module';
import { EditorComponent } from '@applications/shared/communication/components/editor/editor.component';
import { ItemComponent } from '@applications/shared/communication/components/messages/item/item.component';
import { ListMessagesComponent } from '@applications/shared/communication/components/messages/list/messages.component';
import { CommunicationService } from '@applications/shared/communication/service/communication.service';
import { reducer } from '@applications/shared/communication/store/reducer/communication.reducer';
import { CommunicationEffect } from '@applications/shared/communication/store/effect/communication.effect';
import {
  MessagesDialogComponent
} from '@applications/shared/communication/components/messages/messages-dialog/messages-dialog.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';
import { UserChatComponent } from '@applications/shared/communication/components/user-chat/user-chat.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OverlayModule,
    PerfectScrollbarModule,
    InfiniteScrollModule,
    StoreModule.forFeature('communication', reducer),
    EffectsModule.forFeature([CommunicationEffect]),
  ],
  declarations: [
    ConversationListComponent,
    EditorComponent,
    ItemComponent,
    ListMessagesComponent,
    MessagesDialogComponent,
    UserChatComponent,
  ],
  providers: [
    CommunicationService,
    MailboxService,
  ],
  exports: [
    ConversationListComponent,
    EditorComponent,
    ItemComponent,
    ListMessagesComponent,
    MessagesDialogComponent,
    UserChatComponent,
  ],
  entryComponents: [
    MessagesDialogComponent,
    UserChatComponent,
  ],
})
export class CommunicationModule { }
