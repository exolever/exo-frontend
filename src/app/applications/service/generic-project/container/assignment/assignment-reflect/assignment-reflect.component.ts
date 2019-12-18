import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';

import { GenericProject } from '@applications/workspace/projects/models/project.model';
import { AppState } from '@core/store/reducers';
import { UserModel } from '@core/models/user/user.model';
import * as fromUser from '@core/store/user/user.reducer';
import { Quiz, QuizStatus, ReceivedFeedback } from '@applications/service/shared/models';
import { StepModel } from '@applications/workspace/projects/models/step.model';
import { Team } from '@applications/workspace/projects/models/team.model';
import { RoleEnum } from '@core/modules/roles/enums/role.enum';
import { Feedback, FeedbackType } from '@service/shared/models/feedback.model';
import * as fromService from '../../../store/reducer';
import * as StepActions from '../../../store/actions/steps.actions';
import * as fromSteps from '../../../store/reducer/steps.reducer';

@Component({
  templateUrl: './assignment-reflect.component.html'
})
export class AssignmentReflectContainerComponent implements OnInit {
  quizDone$: Observable<boolean>;
  step$: Observable<StepModel>;
  team$: Observable<Team>;
  user$: Observable<UserModel>;
  feedback$: Observable<Feedback>;
  receivedFeedback$: Observable<ReceivedFeedback[]>;
  project: GenericProject;
  role$: Observable<RoleEnum>;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.project = this.route.snapshot.data.project;
    this.user$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.step$ = this.store.pipe(select(state => fromService.getStepSelected(state.genericProject)));
    this.team$ = this.store.pipe(select(state => fromService.selectTeamSelected(state.genericProject)));
    this.feedback$ = this.store.pipe(select(state => fromSteps.selectWeeklyFeedback(state)));
    this.receivedFeedback$ = this.store.pipe(select(state => fromSteps.selectReceivedFeedback(state)));
    this.role$ = this.store.pipe(select(state => fromService.selectHeadCoachOrTeamRole(state.genericProject)));

    this.quizDone$ = this.store.pipe(
      select(state => fromService.selectPersonalQuiz(state.genericProject)),
      map((quiz: Quiz) => quiz.status === QuizStatus.Done)
    );
  }

  openQuiz(step: StepModel) {
    this.store.dispatch(new StepActions.FillGProjectQuiz(step));
  }

  forTeamMember(feedback?: Feedback): boolean {
    return feedback ? feedback.target === FeedbackType.Coach : false;
  }

  onSendFeedback(feedback: Feedback) {
    this.store.dispatch(new StepActions.SendGProjectFeedback(feedback));
  }

  onFillSurvey(url: string) {
    this.store.dispatch(new StepActions.FillGProjectSurvey(url));
  }
}
