import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Feedback } from '@opportunities/shared/services/opportunities-feedback.service';

@Component({
  selector: 'app-feedback-ready',
  templateUrl: './feedback-ready.component.html',
  styleUrls: ['./feedback-ready.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackReadyComponent {

  @Input()
  feedback: Feedback;

  avergateFeedback() {
    return Math.floor((this.feedback.explained + this.feedback.collaboration + this.feedback.communication) / 3);
  }
}
