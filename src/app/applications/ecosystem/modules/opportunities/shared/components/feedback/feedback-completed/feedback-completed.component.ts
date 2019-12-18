import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Feedback } from '@opportunities/shared/services/opportunities-feedback.service';

@Component({
  selector: 'app-feedback-completed',
  templateUrl: './feedback-completed.component.html',
  styleUrls: ['./feedback-completed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackCompletedComponent {

  @Input()
  feedback: Feedback;

  @Input()
  showButton = true;

  @Output()
  feedbackDialog = new EventEmitter<Feedback>();

}
