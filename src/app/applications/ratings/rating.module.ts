import { NgModule } from '@angular/core';

import { DeserializerRatingService, RatingBuilderService } from './services';

@NgModule({
  providers: [
    DeserializerRatingService,
    RatingBuilderService
  ]
})
export class RatingModule { }
