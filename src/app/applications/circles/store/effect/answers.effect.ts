import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, concatMap, filter } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Answer } from '@forum/interfaces/answer.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { AppState } from '@core/store/reducers';
import { CircleService } from '../../services/circle.service';
import * as AnswersActions from '../action/answers.action';
import * as fromState from '../../store/reducer/index';


@Injectable()
export class AnswersEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$
    .pipe(
      ofType(AnswersActions.TypeActionEnum.LOAD_ANSWERS),
      withLatestFrom(
        this.store.pipe(select(state => fromState.selectPageIndexAnswers(state.circles))),
        this.store.pipe(select(state => fromState.selectPageSizeAnswers(state.circles)))
      ),
      switchMap(([action, index, size]: [AnswersActions.LoadAnswers, number, number]) => this.circleService.getAnswers({
        pageIndex: index + 1,
        pageSize: size,
        searchBy: '',
        pkQuestion: action.payload.pkQuestion
      }).pipe(
        catchError(error => this.notify('WRONG', new AnswersActions.LoadAnswersFail(error), true)),
        map((response: Pagination<Answer>) => new AnswersActions.LoadAnswersSuccess(response))
      ))
  );

  @Effect()
  creating$: Observable<Action> = this.actions$
    .pipe(
      ofType(AnswersActions.TypeActionEnum.CREATE_ANSWER),
      concatMap((action: AnswersActions.CreateAnswer) => of(action).pipe(
        withLatestFrom(
          this.store.pipe(
            select(state => fromState.selectPkBySlug(state.circles.questions, action.payload.questionSlug)))
        )
      )),
      filter(([action, pkQuestion]: [AnswersActions.CreateAnswer, number]) => pkQuestion !== undefined),
      switchMap(([action, pkQuestion]: [AnswersActions.CreateAnswer, number]) =>
        this.circleService.createAnswer(pkQuestion, action.payload.data).pipe(
          map((response: Answer) =>
            this.notify('CREATE_ANSWER_OK', new AnswersActions.CreateAnswerSuccess(response)), false),
          catchError(error => this.notify('WRONG', new AnswersActions.CreateAnswerFail(error), true))
        ))
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$
    .pipe(
      ofType(AnswersActions.TypeActionEnum.DELETE_ANSWER),
      switchMap((action: AnswersActions.DeleteAnswer) =>
        this.circleService.deleteAnswer(action.payload).pipe(
          map((_) => this.notify('DELETE_ANSWER_OK', new AnswersActions.DeleteAnswerSuccess(action.payload), false)),
          catchError(error => this.notify('DELETE_ANSWER_FAIL', new AnswersActions.DeleteAnswerFail(error), true))
        )
      )
  );

  @Effect()
  update$: Observable<Action> = this.actions$
    .pipe(
      ofType(AnswersActions.TypeActionEnum.UPDATE_ANSWER),
      switchMap((action: AnswersActions.UpdateAnswer) => this.circleService.editAnswer(
        action.payload.data.pk,
        action.payload.data
      ).pipe(
        map((response) => this.notify('UPDATE_ANSWER_OK', new AnswersActions.UpdateAnswerSuccess(response), false)),
        catchError(error => this.notify('WRONG', new AnswersActions.UpdateAnswerFail(error), true))
      ))
  );

  @Effect()
  markAsFavorite$: Observable<Action> = this.actions$
    .pipe(
      ofType(AnswersActions.TypeActionEnum.SET_FAVORITE),
      switchMap((action: AnswersActions.SetAsFavorite) =>
        this.circleService.setFavoriteAnswer(action.payload, true).pipe(
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
        this.circleService.setFavoriteAnswer(action.payload, false).pipe(
          catchError(error => this.notify('WRONG', new AnswersActions.UnsetAsFavoriteFail(error), true)),
          map((response: Answer) => new AnswersActions.UnsetAsFavoriteSuccess(response))
        )
    )
  );

  @Effect()
  rating$: Observable<Action> = this.actions$.pipe(
    ofType(AnswersActions.TypeActionEnum.RATE_ANSWER),
    switchMap((action: AnswersActions.RateAnswer) =>
      this.circleService.rateAnswer(action.payload.pkAnswer, action.payload.rating).pipe(
        catchError(error => this.notify('RATE_ANSWER_FAIL', new AnswersActions.RateAnswerFail(error), true)),
        map((response: Answer) => new AnswersActions.RateAnswerSuccess(response))
      )
    )
  );

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private circleService: CircleService,
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
