import { NgModule } from '@angular/core';

import { QuillModule } from 'ngx-quill';
import { SharedModule } from '@shared/shared.module';
import { ValidationConfigProvider } from '@core/config/validation-config';

import { PostSummaryComponent } from './components/post-summary/post-summary.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { AnswerComponent } from './components/answer/answer.component';
import { WriteCommentComponent } from './components/write-comment/write-comment.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { FeedItemComponent } from './components/feed-item/feed-item.component';

// This is a dumb module ONLY for presentational components
@NgModule({
  imports: [
    SharedModule,
    QuillModule
  ],
  declarations: [
    PostSummaryComponent,
    PostDetailComponent,
    AnswerComponent,
    WriteCommentComponent,
    StarRatingComponent,
    FeedItemComponent
  ],
  exports: [
    PostSummaryComponent,
    PostDetailComponent,
    AnswerComponent,
    WriteCommentComponent,
    StarRatingComponent,
    FeedItemComponent
  ],
  providers: [
    ValidationConfigProvider
  ]
})

export class ForumModule { }
