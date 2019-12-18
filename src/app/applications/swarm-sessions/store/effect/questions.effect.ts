import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable, defer, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action, Store, select  } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { SwarmSession } from '@applications/swarm-sessions/sharedModule/models/session.model';
import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { AppState } from '@core/store/reducers';

import { SwarmSessionsService } from '../../services/swarm-sessions.service';
import * as QuestionActions from '../action/questions.action';
import * as AnswerActions from '../action/answers.action';
import * as fromState from '../../store/reducer/index';


@Injectable()
export class QuestionsEffect {
  @Effect()
  loadingSessionDetails$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.LOAD_SESSION),
    switchMap((action: QuestionActions.LoadSession) => this.sessionService.getSession(action.payload).pipe(
      catchError(error => this.notify('WRONG', new QuestionActions.LoadSessionFail(error), true)),
      mergeMap((response: SwarmSession) => [
        new QuestionActions.LoadSessionSuccess(response),
        new QuestionActions.LoadQuestions({pageIndex: 1, pageSize: 50, pkSession: response.pk})
      ])
    ))
  );

  @Effect()
  loadingQuestion$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.LOAD_QUESTIONS),
    withLatestFrom(
      this.store$.pipe(select(state => fromState.selectSearchBy(state.swarmSessions)))
    ),
    switchMap(([action, searchBy]: [QuestionActions.LoadQuestions, string]) => this.sessionService.getQuestions({
      pageIndex: action.payload.pageIndex,
      pageSize: action.payload.pageSize,
      pkSession: action.payload.pkSession,
      searchBy: searchBy,
      sortBy: action.payload.sort ? action.payload.sort : 'comments',
    }).pipe(
      catchError(error => this.notify('WRONG', new QuestionActions.LoadQuestionsFail(error), true)),
      map((response: Pagination<Post>) => new QuestionActions.LoadQuestionsSuccess(response))
    ))
  );

  @Effect()
  loadingQuestionDetails$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.LOAD_QUESTION_DETAIL),
    switchMap((action: QuestionActions.LoadQuestionDetails) => this.sessionService.getQuestionDetails({
      pkSession: action.payload.pkSession,
      pkQuestion: action.payload.pkQuestion
    }).pipe(
      catchError(error => this.notify('WRONG', new QuestionActions.LoadQuestionDetailsFail(error), true)),
      map((response: Post) => new QuestionActions.LoadQuestionDetailsSuccess(response))
    ))
  );


  @Effect()
  selecting$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.SELECT_QUESTION),
    mergeMap((action: QuestionActions.SelectQuestion) => [
      new QuestionActions.LoadQuestionDetails({
        pkSession: action.payload.pkSession,
        pkQuestion: action.payload.pkQuestion
      }),
      new AnswerActions.LoadAnswers({
        pkSession: action.payload.pkSession,
        pkQuestion: action.payload.pkQuestion,
        pageSize: 50,
        pageIndex: 1
        })
    ])
  );

  @Effect()
  searching$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.SEARCH),
    withLatestFrom(
      this.store$.pipe(select(state => fromState.selectPageSizeQuestion(state.swarmSessions)))
    ),
    map(([action, pageSize]: [QuestionActions.SetSearch, number]) => new QuestionActions.LoadQuestions({
      pkSession: action.payload.pkSession,
      pageIndex: 1,
      pageSize: pageSize,
      sort: action.payload.sort
    }))
  );

  @Effect()
  markAsFavorite$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SET_FAVORITE),
      switchMap((action: QuestionActions.SetAsFavorite) =>
        this.sessionService.setFavoriteQuestion(action.payload, true).pipe(
          catchError(error => this.notify('WRONG', new QuestionActions.SetAsFavoriteFail(error), true)),
          map((response: Post) => new QuestionActions.SetAsFavoriteSuccess(response))
        )
    )
  );

  @Effect()
  unmarkAsFavorite$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.UNSET_FAVORITE),
      switchMap((action: QuestionActions.SetAsFavorite) =>
        this.sessionService.setFavoriteQuestion(action.payload, false).pipe(
          catchError(error => this.notify('WRONG', new QuestionActions.UnsetAsFavoriteFail(error), true)),
          map((response: Post) => new QuestionActions.UnsetAsFavoriteSuccess(response))
        )
    )
  );

  @Effect()
  initConnectedUsers$: Observable<any> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.ADD_USERS),
    switchMap(() => this.sessionService.getConnectedUsers().pipe(
      catchError(error => this.notify('WRONG', new QuestionActions.InitConnectedUsersFail(error))),
      map((users: string[]) => new QuestionActions.InitConnectedUsersSuccess(users))
    )),
  );

  @Effect()
  sortQuestions$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SORT),
      map((action: QuestionActions.SortQuestions) =>
        new QuestionActions.LoadQuestions({
          pkSession: action.payload.pkSession,
          pageIndex: action.payload.page.index,
          pageSize: action.payload.page.size,
          sort: action.payload.sort,
        })
      )
    );

  @Effect({ dispatch: true })
  init$: Observable<any> = defer(() => of(null)).pipe(
    map(() => new QuestionActions.InitConnectedUsers())
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
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
