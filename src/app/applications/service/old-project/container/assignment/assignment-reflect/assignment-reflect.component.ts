import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import { UserModel } from '@core/models/user/user.model';
import * as fromUser from '@core/store/user/user.reducer';
import * as fromProjects from '@applications/service/old-project/store/project';
import { Quiz, QuizStatus, ReceivedFeedback } from '@applications/service/shared/models';
import { SprintRoleEnum } from '@core/modules/roles/enums/role.enum';

import { Feedback, FeedbackType } from '../../../../shared/models/feedback.model';
import { Step } from '../../../models/step.model';
import * as fromService from '../../../store/reducers';
import * as StepActions from '../../../store/steps/step.actions';
import * as fromSteps from '../../../store/steps/step.reducer';

@Component({
  templateUrl: './assignment-reflect.component.html'
})
export class AssignmentReflectContainerComponent implements OnInit {
  quizDone$: Observable<boolean>;
  step$: Observable<Step>;
  user$: Observable<UserModel>;
  feedback$: Observable<Feedback>;
  receivedFeedback$: Observable<ReceivedFeedback[]>;
  role$: Observable<string | SprintRoleEnum>;

  constructor(
    private store: Store<AppState>
  ) {
  }

  ngOnInit() {
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.step$ = this.store.pipe(select(fromService.getStepSelected));
    this.feedback$ = this.store.pipe(select(state => fromSteps.selectWeeklyFeedback(state)));
    this.receivedFeedback$ = this.store.pipe(select(state => fromSteps.selectReceivedFeedback(state)));
    this.role$ = this.store.pipe(select(state => fromProjects.selectHeadCoachOrTeamRole(state)));
    this.quizDone$ = this.store.pipe(
      select(state => fromService.selectPersonalQuiz(state)),
      map((quiz: Quiz) => quiz.status === QuizStatus.Done)
    );
  }

  openQuiz(step: Step) {
    this.store.dispatch(new StepActions.FillQuiz(step));
  }

  forTeamMember(feedback?: Feedback): boolean {
    return feedback ? feedback.target === FeedbackType.Coach : false;
  }

  onSendFeedback(feedback: Feedback) {
    this.store.dispatch(new StepActions.SendFeedback(feedback));
  }

  onFillSurvey(url: string) {
    this.store.dispatch(new StepActions.FillSurvey(url));
  }
}
