import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailboxsComponent } from './containers/mailboxs-layout/mailboxs.component';
import { MailboxRoutingModule } from '@ecosystem/modules/mailbox/mailbox-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MailboxListComponent } from './containers/mailbox-list/mailbox-list.component';
import { MailboxService } from '@ecosystem/modules/mailbox/services/mailbox.service';
import { CommunicationModule } from '@applications/shared/communication/communication.module';

@NgModule({
  declarations: [
    MailboxsComponent,
    MailboxListComponent
  ],
  imports: [
    CommonModule,
    MailboxRoutingModule,
    SharedModule,
    CommunicationModule,
  ],
  providers: [
    MailboxService,
  ],
})
export class MailboxModule { }
