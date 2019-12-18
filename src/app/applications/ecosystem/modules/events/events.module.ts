import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material';

import { ShareButtonsModule } from '@ngx-share/buttons';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { EditorModule } from '@tinymce/tinymce-angular';

import { CustomMd2DatepickerModule } from '@shared/md2/custom-md2-datepicker.module';
import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';
import { SharedMediaModule } from '@ecosystem-media-library/shared/shared-media.module';
import { OpportunitiesSharedModule } from '@opportunities/shared/opportunities-shared.module';
import { EventEditionGuard } from '@ecosystem/modules/events/components/modal-save-changes.guard';

import { EventService } from './service/events.service';
import { EventsEffect } from './store/events.effect';
import { reducer } from './store/events.reducer';
import {
  AtendeesProfileComponent,
  EventsCardComponent,
  EventsCardPreviewComponent,
  EventsContainerComponent,
  EventsFormLayoutComponent,
  EventsListComponent,
  FormAttendeeComponent,
  FormImportAttendeeComponent,
  WorkshopProfileComponent,
  EventFormComponent,
  UploadImageComponent,
} from './components';
import { EventsRoutingModule } from './events-routing.module';


@NgModule({
  imports: [
    EventsRoutingModule,
    SharedModule,
    StoreModule.forFeature('events', reducer),
    EffectsModule.forFeature([EventsEffect]),
    CustomMd2DatepickerModule,
    MatTableModule,
    ShareButtonsModule,
    LoaderModule,
    SharedMediaModule,
    ReactiveFormsModule,
    EditorModule,
    OpportunitiesSharedModule,
  ],
  providers: [
    EventService,
    EventEditionGuard
  ],
  declarations: [
    EventsContainerComponent,
    EventsListComponent,
    EventFormComponent,
    WorkshopProfileComponent,
    AtendeesProfileComponent,
    EventsFormLayoutComponent,
    FormAttendeeComponent,
    FormImportAttendeeComponent,
    EventsCardComponent,
    EventsCardPreviewComponent,
    UploadImageComponent,
  ],
  entryComponents: [
    FormAttendeeComponent,
    FormImportAttendeeComponent
  ]
})
export class EventsModule {
}
