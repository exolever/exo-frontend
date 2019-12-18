import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';


import { StepService } from '../../services/step.service';
import * as StepsActions from '../action/steps.action';
import { StepModel } from '../../models/step.model';

@Injectable()
export class StepsEffect {
  @Effect()
  loadingSteps$: Observable<Action> = this.actions$
    .pipe(
      ofType(StepsActions.TypeActionEnum.LOAD),
      switchMap((action: StepsActions.Load) =>
        this.stepService.getSteps(action.payload).pipe(
          catchError(error => this.notify('WRONG', new StepsActions.LoadFail(error), true)),
          map((steps: StepModel[]) => new StepsActions.LoadSuccess(steps))
        ))
  );

  @Effect()
  editingStep$: Observable<Action> = this.actions$
    .pipe(
      ofType(StepsActions.TypeActionEnum.EDIT),
      switchMap((action: StepsActions.Edit) =>
        this.stepService.editStep(action.payload.step, action.payload.projectPk).pipe(
          map((_) => this.notify('EDIT.SUCCESS_STEP', new StepsActions.Load(action.payload.projectPk), false)),
          catchError(error => this.notify('WRONG', new StepsActions.EditFail(error), true))
        ))
  );

  constructor(
    private actions$: Actions,
    private stepService: StepService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('ECOSYSTEM.WORKSPACE.PROJECTS.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
