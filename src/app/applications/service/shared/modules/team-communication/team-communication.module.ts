import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TeamCommunicationComponent } from './container/team-communication.component';
import { SharedModule } from '@shared/shared.module';
import { OverlayModule } from '@overlay/overlay.module';
import { CommunicationModule } from '@applications/shared/communication/communication.module';
import { LoaderModule } from '@loaders/loader.module';

const routes: Routes = [
  {
    path: '',
    component: TeamCommunicationComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    OverlayModule,
    CommunicationModule,
    LoaderModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    TeamCommunicationComponent,
  ],
})
export class TeamCommunicationModule { }
