import { Component, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { EMPTY, Observable } from 'rxjs';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action, select, Store } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { TranslateService } from '@ngx-translate/core';

import { Feedback } from '@applications/service/shared/models/feedback.model';
import { Task } from '@applications/service/shared/modules/tasks/models';
import { SNACK_BAR_CONFIG } from '@applications/service/shared/service.conf';
import { TypeFormIntegrationComponent } from '@shared/components/typeform-integration/typeform-integration.component';
import { OverlayService } from '@overlay/services/overlay.service';
import { AppState } from '@core/store/reducers';
import * as fromProject from '@applications/service/old-project/store/project';

import { ServiceInformationService, StepService  } from '../../services';
import * as fromService from '../reducers';
import { Step } from '../../models/step.model';
import * as StepActions from './step.actions';

@Injectable()
export class StepEffects {

  @Effect()
  loadSteps$ = this.actions$.pipe(
    ofType(StepActions.LOAD_STEPS),
    switchMap((res: StepActions.LoadSteps) => this.stepService.getSteps(res.payload.pkService, res.payload.pkTeam).pipe(
      mergeMap((steps: Step[]) => [
        new StepActions.LoadStepsSuccess(steps),
      ])
    )),
  );

  @Effect()
  loadStep$ = this.actions$.pipe(
    ofType(StepActions.LOAD_STEP),
    switchMap((res: StepActions.LoadStep) =>
      this.stepService.getStep(res.payload.pkService, res.payload.pkTeam, res.payload.pkStep).pipe(
        map((step: Step) => new StepActions.LoadStepSuccess(step))
      )
    ),
  );

  @Effect()
  markOneDone$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.MARK_AS_DONE_ONE),
    switchMap((action: StepActions.MarkOneTaskAsDone) =>
      this.infoService.markTaskAsDone(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.task
      ).pipe(
        map((task: Task) => {
          return {
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            task: task
          };
        }),
        map((response: { projectPk: string, teamPk: string, stepPk: string, task: Task }) =>
          new StepActions.MarkTaskAsDoneSuccess({
            projectPk: response.projectPk,
            teamPk: response.teamPk,
            stepPk: response.stepPk,
            tasks: [response.task]
          })
        )
      )
    ),
  );

  @Effect()
  markOneTodo$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.MARK_AS_TODO_ONE),
    switchMap((action: StepActions.MarkOneTaskAsToDo) =>
      this.infoService.markTaskAsTodo(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.task
      ).pipe(
        map((task: Task) => {
          return {
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            task: task
          };
        }),
        map((response: { projectPk: string, teamPk: string, stepPk: string, task: Task }) =>
          new StepActions.MarkTaskAsToDoSuccess({
            projectPk: response.projectPk,
            teamPk: response.teamPk,
            stepPk: response.stepPk,
            tasks: [response.task]
          })
        )
      )
    ),
  );

  @Effect()
  markManyDone$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.MARK_AS_DONE_MANY),
    switchMap((action: StepActions.MarkManyTaskAsDone) =>
      this.infoService.markTasksAsDone(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.tasks
      ).pipe(
        map((tasks: Task[]) => {
          return {
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            tasks: tasks
          };
        }),
        map((response: { projectPk: string, teamPk: string, stepPk: string, tasks: Task[] }) =>
          new StepActions.MarkTaskAsDoneSuccess({
            projectPk: response.projectPk,
            teamPk: response.teamPk,
            stepPk: response.stepPk,
            tasks: response.tasks
          })
        )
      )
    ),
  );

  @Effect()
  markManyTodo$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.MARK_AS_TODO_MANY),
    switchMap((action: StepActions.MarkManyTaskAsToDo) =>
      this.infoService.markTasksAsToDo(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.tasks
      ).pipe(
        map((tasks: Task[]) => {
          return {
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            tasks: tasks
          };
        }),
        map((response: { projectPk: string, teamPk: string, stepPk: string, tasks: Task[] }) =>
          new StepActions.MarkTaskAsToDoSuccess({
            projectPk: response.projectPk,
            teamPk: response.teamPk,
            stepPk: response.stepPk,
            tasks: response.tasks
          })
        )
      )
    ),
  );

  @Effect()
  sendFeedback$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.SEND_FEEDBACK),
    withLatestFrom(
      this.store.pipe(select(fromService.getTeamSelectedPk)),
      this.store.pipe(select(fromProject.getSelectedProjectPk)),
      this.store.pipe(select(fromService.getStepSelectedPk))
    ),
    switchMap(([action, pkTeam, pkProject, pkStep]) =>
      this.infoService.sendFeedback(pkProject, pkTeam, pkStep, action['payload']).pipe(
        map((feedback: Feedback) => {
          this.snackBar.open(
            this.translator.instant('SERVICE.REFLECT.PERSONAL_FEEDBACK.FEEDBACK_SUCCESS'),
            this.translator.instant('COMMON.CLOSE'), SNACK_BAR_CONFIG);
          return new StepActions.SendFeedbackSuccess(feedback);
        })
      )
    ),
  );

  @Effect()
  openQuiz$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.FILL_QUIZ),
    map((action: StepActions.FillQuiz) => action.payload),
    switchMap((step: Step) => {
      this.overlayService.open(<Component>TypeFormIntegrationComponent, {
        data: {
          title: this.translator.instant('SERVICE.REFLECT.TYPEFORM_TITLE', { stepName: step.name }),
          url: step.personalQuiz.url
        }
      }
      );
      return EMPTY;
    })
  );

  @Effect()
  fillSurvey$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.FILL_SURVEY),
    map((action: StepActions.FillSurvey) => action.payload),
    switchMap((url: string) => {
      this.overlayService.open(<Component>TypeFormIntegrationComponent, {
        data: {
          title: this.translator.instant('SERVICE.REFLECT.PERSONAL_FEEDBACK.FEEDBACK_TITLE'), url: url
        }
      }
      );
      return EMPTY;
    })
  );

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private stepService: StepService,
    private infoService: ServiceInformationService,
    private overlayService: OverlayService,
    private translator: TranslateService,
    private snackBar: MatSnackBar
  ) {
  }

}
