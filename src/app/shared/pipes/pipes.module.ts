import { NgModule } from '@angular/core';
import { FormatDatePipe } from './format-date.pipe';
import { FormatTimezonePipe } from './format-timezone.pipe';
import { GroupByDay } from './group-by-date';
import { HumanizeFormErrorsPipe } from './humanize-form-errors.pipe';
import { LetterKeysPipe } from './keys.pipe';
import { JoinPipe } from './join.pipe';
import { SafeHtmlPipe } from './safeHtml.pipe';
import { ReplacePipe } from './replace.pipe';
import { FormatDurationTimePipe } from './duration.pipe';
import { OrderMomentDatePipe } from './order-moment-date.pipe';
import { StripHtmlPipe } from './strip-html.pipe';

@NgModule({
  imports: [],
  declarations: [
    FormatDatePipe,
    FormatDurationTimePipe,
    FormatTimezonePipe,
    GroupByDay,
    HumanizeFormErrorsPipe,
    JoinPipe,
    LetterKeysPipe,
    SafeHtmlPipe,
    ReplacePipe,
    OrderMomentDatePipe,
    StripHtmlPipe
  ],
  exports: [
    FormatDatePipe,
    FormatDurationTimePipe,
    FormatTimezonePipe,
    GroupByDay,
    HumanizeFormErrorsPipe,
    JoinPipe,
    LetterKeysPipe,
    SafeHtmlPipe,
    ReplacePipe,
    OrderMomentDatePipe,
    StripHtmlPipe
  ],
  providers: [
    FormatDatePipe
  ]
})

export class PipeModule { }
