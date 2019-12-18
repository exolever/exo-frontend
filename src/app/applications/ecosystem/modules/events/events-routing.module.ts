import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  AtendeesProfileComponent,
  EventsContainerComponent,
  EventsFormLayoutComponent,
  WorkshopProfileComponent,
} from './components';
import {EventEditionGuard} from '@ecosystem/modules/events/components/modal-save-changes.guard';


const routes: Routes = [
  {
    path: '',
    component: EventsContainerComponent,
  },
  {
    path: 'new',
    component: EventsFormLayoutComponent,
    canDeactivate: [EventEditionGuard]
  },
  {
    path: 'review/:uuid',
    component: EventsFormLayoutComponent,
  },
  {
    path: 'details/:uuid',
    component: WorkshopProfileComponent,
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: EventsFormLayoutComponent, canDeactivate: [EventEditionGuard] },
      { path: 'attendees', component: AtendeesProfileComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EventsRoutingModule { }
