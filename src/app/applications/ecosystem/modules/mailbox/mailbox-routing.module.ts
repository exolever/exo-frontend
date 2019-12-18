import { RouterModule, Routes } from '@angular/router';
import { MailboxsComponent } from '@ecosystem/modules/mailbox/containers/mailboxs-layout/mailboxs.component';
import { NgModule } from '@angular/core';
import { MailboxListComponent } from '@ecosystem/modules/mailbox/containers/mailbox-list/mailbox-list.component';

const ROUTES: Routes = [
  {
    path: '',
    component: MailboxsComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: MailboxListComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
})
export class MailboxRoutingModule { }
