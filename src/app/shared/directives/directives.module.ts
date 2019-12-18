import { NgModule } from '@angular/core';

import {
  LineClampDirective,
  StickyOnScrollDirective,
  TruncateStringDirective,
  GooglePlacesDirective,
} from '@shared/directives';

@NgModule({
  declarations: [
    LineClampDirective,
    StickyOnScrollDirective,
    TruncateStringDirective,
    GooglePlacesDirective,
  ],
  exports: [
    LineClampDirective,
    StickyOnScrollDirective,
    TruncateStringDirective,
    GooglePlacesDirective,
  ]
})
export class DirectivesModule { }
