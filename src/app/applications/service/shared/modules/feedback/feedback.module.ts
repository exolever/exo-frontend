import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import {
  OverlayMediaComponent
} from '@ecosystem-media-library/components/overlay-media/components/overlay-media.component';
import { OverlayMediaService } from '@ecosystem-media-library/components/overlay-media/services/overlay-media.service';
import {
  FeedbackComponent,
  FeedbackReceivedComponent,
  FeedbackReceivedFeelingsComponent,
  FeedbackReceivedRatesComponent,
  FeedbackReceivedCommentsComponent,
  TeamRankComponent
} from './index';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    TeamRankComponent,
    FeedbackComponent,
    FeedbackReceivedComponent,
    FeedbackReceivedFeelingsComponent,
    FeedbackReceivedRatesComponent,
    FeedbackReceivedCommentsComponent
  ],
  exports: [
    TeamRankComponent,
    FeedbackComponent,
    FeedbackReceivedComponent,
    FeedbackReceivedFeelingsComponent,
    FeedbackReceivedRatesComponent,
    FeedbackReceivedCommentsComponent
  ],
  providers: [
    OverlayMediaService
  ],
  entryComponents: [
    OverlayMediaComponent,
    FeedbackReceivedFeelingsComponent,
    FeedbackReceivedRatesComponent,
    FeedbackReceivedCommentsComponent
  ]
})
export class FeedbackModule { }
