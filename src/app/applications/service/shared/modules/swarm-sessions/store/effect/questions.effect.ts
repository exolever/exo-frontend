import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action, Store, select  } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { AppState } from '@core/store/reducers';

import { SwarmSessionsService } from '../../services/swarm-sessions.service';
import * as QuestionActions from '../action/questions.action';
import * as AnswerActions from '../action/answers.action';
import * as fromState from '../reducer/index';

@Injectable()
export class QuestionsEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.LOAD_QUESTIONS),
      withLatestFrom(
        this.store$.pipe(select(state => fromState.selectSearchBy(state.swarmSessions)))
      ),
      switchMap(([action, searchBy]: [QuestionActions.LoadQuestions, string]) => this.sessionService.getQuestions({
        pageIndex: action.payload.pageIndex,
        pageSize: action.payload.pageSize,
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkSession: action.payload.pkSession,
        searchBy: searchBy,
        sortBy: action.payload.sortBy ? action.payload.sortBy : 'comments',
      }).pipe(
        catchError(error => this.notify('WRONG', new QuestionActions.LoadQuestionsFail(error), true)),
        map((response: Pagination<Post>) => new QuestionActions.LoadQuestionsSuccess(response)),
      )),
  );

  @Effect()
  loadingDetails$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.LOAD_QUESTION_DETAIL),
      switchMap((action: QuestionActions.LoadQuestionDetails) => this.sessionService.getQuestionDetails({
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkSession: action.payload.pkSession,
        pkQuestion: action.payload.pkQuestion
      }).pipe(
        catchError(error =>
          this.notify('WRONG', new QuestionActions.LoadQuestionDetailsFail(error), true)),
        map((response: Post) => new QuestionActions.LoadQuestionDetailsSuccess(response)),
      )),
  );

  @Effect()
  creating$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.CREATE_QUESTION),
      switchMap((action: QuestionActions.CreateQuestion) => this.sessionService.createQuestion({
        data: action.payload.data,
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkSession: action.payload.pkSession
      }).pipe(
        map((response) => this.notify(
          'CREATE_QUESTION_OK', new QuestionActions.CreateQuestionSuccess(response), false)),
        catchError(error => this.notify('WRONG', new QuestionActions.CreateQuestionFail(error), true))
      )),
  );

  @Effect()
  editing$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.EDIT_QUESTION),
      switchMap((action: QuestionActions.EditQuestion) => this.sessionService.editQuestion({
        data: action.payload.data,
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkSession: action.payload.pkSession,
        pkQuestion: action.payload.pkQuestion
      }).pipe(
        map((response) => this.notify('EDIT_QUESTION_OK', new QuestionActions.EditQuestionSuccess(response), false)),
        catchError(error => this.notify('WRONG', new QuestionActions.EditQuestionFail(error), true))
      )),
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.DELETE_QUESTION),
      switchMap((action: QuestionActions.DeleteQuestion) => this.sessionService.deleteQuestion({
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkSession: action.payload.pkSession,
        pkQuestion: action.payload.pkQuestion
      }).pipe(
        map((response) =>
          this.notify(
            'DELETE_QUESTION_OK', new QuestionActions.DeleteQuestionSuccess(action.payload.pkQuestion), false)),
        catchError(error => this.notify('WRONG', new QuestionActions.DeleteQuestionFail(error), true))
      )),
  );

  @Effect()
  selecting$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SELECT_QUESTION),
      mergeMap((action: QuestionActions.SelectQuestion) => [
        new QuestionActions.LoadQuestionDetails({
          pkProject: action.payload.pkProject,
          pkTeam: action.payload.pkTeam,
          pkSession: action.payload.pkSession,
          pkQuestion: action.payload.pkQuestion
        }),
        new AnswerActions.LoadAnswers({
          pkProject: action.payload.pkProject,
          pkTeam: action.payload.pkTeam,
          pkSession: action.payload.pkSession,
          pkQuestion: action.payload.pkQuestion,
          pageSize: 50,
          pageIndex: 1
        })
      ])
  );

  @Effect()
  searching$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SEARCH),
      withLatestFrom(
        this.store$.pipe(select(state => fromState.selectPageSizeQuestion(state.swarmSessions)))
      ),
      map(([action, pageSize]: [QuestionActions.SetSearch, number]) => new QuestionActions.LoadQuestions({
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkSession: action.payload.pkSession,
        pageIndex: 1,
        pageSize: pageSize,
        sortBy: action.payload.sort
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
  sortQuestions$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SORT),
      map((action: QuestionActions.SortQuestions) => new QuestionActions.LoadQuestions({
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkSession: action.payload.pkSession,
        pageIndex: action.payload.page.index,
        pageSize: action.payload.page.size,
        sortBy: action.payload.sort,
      }))
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
