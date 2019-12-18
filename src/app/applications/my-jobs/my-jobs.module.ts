import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '@shared/shared.module';
import { LoaderModule } from '@loaders/loader.module';

import { MyJobsService } from './services/my-jobs.service';
import { MyJobsEffect } from './store/my-jobs.effect';
import { reducer } from './store/my-jobs.reducer';
import { MyJobsComponent } from './components/my-jobs.component';
import { MyJobsRoutingModule } from './my-jobs-routing.module';
import { MyJobsCardComponent } from './components/my-jobs-card/my-jobs-card.component';

@NgModule({
  imports: [
    SharedModule,
    LoaderModule,
    MyJobsRoutingModule,
    StoreModule.forFeature('jobs', reducer),
    EffectsModule.forFeature([MyJobsEffect])
  ],
  providers: [MyJobsService],
  declarations: [MyJobsComponent, MyJobsCardComponent],
  entryComponents: [MyJobsComponent]
})
export class MyJobsModule { }
