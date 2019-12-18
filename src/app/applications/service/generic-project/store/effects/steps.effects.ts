import {Component, Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';

import { Observable, of as observableOf } from 'rxjs';
import {map, switchMap, withLatestFrom, tap, catchError} from 'rxjs/operators';
import {Action, select, Store} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {TranslateService} from '@ngx-translate/core';

import { Feedback } from '@applications/service/shared/models/feedback.model';
import {Task} from '@applications/service/shared/modules/tasks/models';
import {SNACK_BAR_CONFIG} from '@applications/service/shared/service.conf';
import {TypeFormIntegrationComponent} from '@shared/components/typeform-integration/typeform-integration.component';
import {OverlayService} from '@overlay/services/overlay.service';
import {AppState} from '@core/store/reducers';
import { StepModel } from '@applications/workspace/projects/models/step.model';

import * as fromReducer from '../reducer/index';
import * as StepActions from '../actions/steps.actions';
import { StepsService } from '../../services/steps.service';

@Injectable()
export class StepEffects {

  @Effect()
  loadGProjectStep$ = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.LOAD_GPROJECT_STEP),
    switchMap((res: StepActions.LoadGProjectStep) =>
      this.stepService.getStep(res.payload.pkService, res.payload.pkTeam, res.payload.pkStep).pipe(
        map((step: StepModel) => new StepActions.LoadGProjectStepSuccess(step)),
        catchError(error => observableOf(new StepActions.LoadGProjectStepFail(error)))
      )
    ),
  );

  @Effect()
  markOneGProjectTaskDone$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.MARK_ONE_GPROJECT_TASK_AS_DONE),
    switchMap((action: StepActions.MarkOneGProjectTaskAsDone) =>
      this.stepService.markTaskAsDone(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.task
      ).pipe(
        map((task: Task) => {
          return new StepActions.MarkGProjectTaskAsDoneSuccess({
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            tasks: [task]
          });
        })
      )
    ),
  );

  @Effect()
  markOneGProjectTaskTodo$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.MARK_GPROJECT_TASK_AS_TODO_ONE),
    switchMap((action: StepActions.MarkOneGProjectTaskAsToDo) =>
      this.stepService.markTaskAsTodo(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.task
      ).pipe(
        map((task: Task) => {
          return new StepActions.MarkGProjectTaskAsToDoSuccess({
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            tasks: [task]
          });
        })
      )
    ),
  );

  @Effect()
  markManyGProjectTaskDone$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.MARK_MANY_GPROJECT_TASKS_AS_DONE),
    switchMap((action: StepActions.MarkManyGProjectTaskAsDone) =>
      this.stepService.markTasksAsDone(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.tasks
      ).pipe(
        map((tasks: Task[]) => {
          return new StepActions.MarkGProjectTaskAsDoneSuccess({
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            tasks: tasks
          });
        })
      )
    ),
  );

  @Effect()
  markManyGProjectTaskTodo$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.MARK_GPROJECT_TASK_AS_TODO_MANY),
    switchMap((action: StepActions.MarkManyGProjectTaskAsToDo) =>
      this.stepService.markTasksAsToDo(
        action.payload.projectPk, action.payload.teamPk, action.payload.stepPk, action.payload.tasks
      ).pipe(
        map((tasks: Task[]) => {
          return new StepActions.MarkGProjectTaskAsToDoSuccess({
            projectPk: action.payload.projectPk,
            teamPk: action.payload.teamPk,
            stepPk: action.payload.stepPk,
            tasks: tasks
          });
        }),
      )
    ),
  );

  @Effect()
  sendGProjectFeedback$: Observable<Action> = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.SEND_GPROJECT_FEEDBACK),
    withLatestFrom(
      this.store.pipe(select(state => fromReducer.selectSelectedTeamPk(state.genericProject))),
      this.store.pipe(select(state => fromReducer.selectSelectedGProject(state.genericProject))),
      this.store.pipe(select(state => fromReducer.selectSelectedStepPk(state.genericProject)))
    ),
    switchMap(([action, pkTeam, genericProject, pkStep]) =>
      this.stepService.sendFeedback(genericProject.pk, pkTeam, pkStep, action['payload']).pipe(
        map((feedback: Feedback) => {
          this.snackBar.open(
            this.translator.instant('SERVICE.REFLECT.PERSONAL_FEEDBACK.FEEDBACK_SUCCESS'),
            this.translator.instant('COMMON.CLOSE'), SNACK_BAR_CONFIG);
          return new StepActions.SendGProjectFeedbackSuccess(feedback);
        })
      )
    ),
  );

  @Effect({ dispatch: false })
  openGProjectQuiz$ = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.FILL_GPROJECT_QUIZ),
    map((action: StepActions.FillGProjectQuiz) => action.payload),
    tap((step: StepModel) => {
      this.overlayService.open(<Component>TypeFormIntegrationComponent, {
          data: {
            title: this.translator.instant('SERVICE.REFLECT.TYPEFORM_TITLE', {stepName: step.name}),
            url: step.personalQuiz.url
          }
        }
      );
    })
  );

  @Effect({ dispatch: false })
  fillGProjectSurvey$ = this.actions$.pipe(
    ofType(StepActions.TypeActionEnum.FILL_GPROJECT_SURVEY),
    map((action: StepActions.FillGProjectSurvey) => action.payload),
    tap((url: string) => {
      this.overlayService.open(<Component>TypeFormIntegrationComponent, {
          data: {
            title: this.translator.instant('SERVICE.REFLECT.PERSONAL_FEEDBACK.FEEDBACK_TITLE'), url: url
          }
        }
      );
    })
  );

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private stepService: StepsService,
    private overlayService: OverlayService,
    private translator: TranslateService,
    private snackBar: MatSnackBar
  ) {
  }

}
