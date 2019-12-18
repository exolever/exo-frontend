import { Injectable } from '@angular/core';

import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

import { SwarmSessionsService } from '../../services/swarm-sessions.service';
import * as AnswersActions from '../action/answers.action';
import { Answer } from '@forum/interfaces/answer.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class AnswersEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$.pipe(
    ofType(AnswersActions.TypeActionEnum.LOAD_ANSWERS),
    switchMap((action: AnswersActions.LoadAnswers) => this.sessionService.getAnswers(action.payload).pipe(
      catchError(error => this.notify('WRONG', new AnswersActions.LoadAnswersFail(error), true)),
      map((response: Pagination<Answer>) => new AnswersActions.LoadAnswersSuccess(response))
    ))
  );

  @Effect()
  creating$: Observable<Action> = this.actions$.pipe(
    ofType(AnswersActions.TypeActionEnum.CREATE_ANSWER),
    switchMap((action: AnswersActions.CreateAnswer) => this.sessionService.createAnswer(action.payload).pipe(
      map((response: Answer) =>
        this.notify('CREATE_ANSWER_OK', new AnswersActions.CreateAnswerSuccess(response)), false),
      catchError(error => this.notify('WRONG', new AnswersActions.CreateAnswerFail(error), true))
    ))
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$.pipe(
    ofType(AnswersActions.TypeActionEnum.DELETE_ANSWER),
    switchMap((action: AnswersActions.DeleteAnswer) => this.sessionService.deleteAnswer({
      pkSession: action.payload.pkSession,
      pkQuestion: action.payload.pkQuestion,
      pkAnswer: action.payload.pkAnswer
    }).pipe(
      map(response =>
        this.notify('DELETE_ANSWER_OK', new AnswersActions.DeleteAnswerSuccess(action.payload.pkAnswer), false)),
      catchError(error => this.notify('WRONG', new AnswersActions.DeleteAnswerFail(error), true))
    ))
  );

  @Effect()
  update$: Observable<Action> = this.actions$.pipe(
    ofType(AnswersActions.TypeActionEnum.UPDATE_ANSWER),
    switchMap((action: AnswersActions.UpdateAnswer) => this.sessionService.editAnswer({
      pkSession: action.payload.pkSession,
      pkQuestion: action.payload.pkQuestion,
      pkAnswer: action.payload.data.pk,
      data: action.payload.data
    }).pipe(
      map((response) => this.notify('UPDATE_ANSWER_OK', new AnswersActions.UpdateAnswerSuccess(response), false)),
      catchError(error => this.notify('WRONG', new AnswersActions.UpdateAnswerFail(error), true))
    ))
  );

  @Effect()
  markAsFavorite$: Observable<Action> = this.actions$
    .pipe(
      ofType(AnswersActions.TypeActionEnum.SET_FAVORITE),
      switchMap((action: AnswersActions.SetAsFavorite) =>
        this.sessionService.setFavoriteAnswer(action.payload, true).pipe(
          catchError(error => this.notify('WRONG', new AnswersActions.SetAsFavoriteFail(error), true)),
          map((response: Answer) => new AnswersActions.SetAsFavoriteSuccess(response))
        )
    )
  );

  @Effect()
  unmarkAsFavorite$: Observable<Action> = this.actions$
    .pipe(
      ofType(AnswersActions.TypeActionEnum.UNSET_FAVORITE),
      switchMap((action: AnswersActions.SetAsFavorite) =>
        this.sessionService.setFavoriteAnswer(action.payload, false).pipe(
          catchError(error => this.notify('WRONG', new AnswersActions.UnsetAsFavoriteFail(error), true)),
          map((response: Answer) => new AnswersActions.UnsetAsFavoriteSuccess(response))
        )
    )
  );

  constructor(
    private actions$: Actions,
    private sessionService: SwarmSessionsService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('SWARM.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
