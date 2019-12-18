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

import { AskToEcosystemService } from '../../services/ask-to-ecosystem.service';
import * as QuestionActions from '../action/questions.action';
import * as AnswerActions from '../action/answers.action';
import * as fromState from '../../store/reducer/index';

@Injectable()
export class QuestionsEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.LOAD_QUESTIONS),
    withLatestFrom(
      this.store$.pipe(select(state => fromState.selectSearchBy(state.askToEcosystem)))
    ),
    switchMap(([action, searchBy]: [QuestionActions.LoadQuestions, string]) => this.askService.getQuestions({
      pageIndex: action.payload.pageIndex,
      pageSize: action.payload.pageSize,
      pkTeam: action.payload.pkTeam,
      pkProject: action.payload.pkProject,
      searchBy: searchBy
      }).pipe(
        catchError(error => this.notify('LOADING_QUESTIONS_FAIL',
          new QuestionActions.LoadQuestionsFail(error), true)),
        map((response: Pagination<Post>) => new QuestionActions.LoadQuestionsSuccess(response)),
      )
    )
  );

  @Effect()
  loadingDetails$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.LOAD_QUESTION_DETAIL),
      switchMap((action: QuestionActions.LoadQuestionDetails) => this.askService.getQuestionDetails({
        pkTeam: action.payload.pkTeam,
        pkProject: action.payload.pkProject,
        pkQuestion: action.payload.pkQuestion
      }).pipe(
        catchError(error =>
          this.notify('WRONG', new QuestionActions.LoadQuestionDetailsFail(error), true)),
        map((response: Post) => new QuestionActions.LoadQuestionDetailsSuccess(response)),
      )),
  );

  @Effect()
  creating$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.CREATE_QUESTION),
    switchMap((action: QuestionActions.CreateQuestion) => this.askService.createQuestion({
      data: action.payload.data,
      pkTeam: action.payload.pkTeam,
      pkProject: action.payload.pkProject
    }).pipe(
      map((response) => this.notify('CREATE_QUESTION_OK', new QuestionActions.CreateQuestionSuccess(response), false)),
      catchError(error => this.notify('CREATE_QUESTION_FAIL', new QuestionActions.CreateQuestionFail(error), true))
    ))
  );

  @Effect()
  editing$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.EDIT_QUESTION),
    switchMap((action: QuestionActions.EditQuestion) => this.askService.editQuestion({
      data: action.payload.data,
      pkTeam: action.payload.pkTeam,
      pkProject: action.payload.pkProject,
      pkQuestion: action.payload.pkQuestion
    }).pipe(
      map((response) => this.notify('EDIT_QUESTION_OK', new QuestionActions.EditQuestionSuccess(response), false)),
      catchError(error => this.notify('EDIT_QUESTION_FAIL', new QuestionActions.EditQuestionFail(error), true))
    ))
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.DELETE_QUESTION),
    switchMap((action: QuestionActions.DeleteQuestion) => this.askService.deleteQuestion({
      pkTeam: action.payload.pkTeam,
      pkProject: action.payload.pkProject,
      pkQuestion: action.payload.pkQuestion
    }).pipe(
      map(response =>
        this.notify('DELETE_QUESTION_OK', new QuestionActions.DeleteQuestionSuccess(action.payload.pkQuestion), false)),
      catchError(error => this.notify('DELETE_QUESTION_FAIL', new QuestionActions.DeleteQuestionFail(error), true))
    ))
  );

  @Effect()
  selecting$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SELECT_QUESTION),
      mergeMap((action: QuestionActions.SelectQuestion) => [
        new QuestionActions.LoadQuestionDetails({
          pkProject: action.payload.pkProject,
          pkTeam: action.payload.pkTeam,
          pkQuestion: action.payload.pkQuestion
        }),
        new AnswerActions.LoadAnswers({
          pkProject: action.payload.pkProject,
          pkTeam: action.payload.pkTeam,
          pkQuestion: action.payload.pkQuestion,
          pageSize: 15,
          pageIndex: 1
        })
      ])
  );

  @Effect()
  searching$: Observable<Action> = this.actions$.pipe(
    ofType(QuestionActions.TypeActionEnum.SEARCH),
    withLatestFrom(
      this.store$.pipe(select(state => fromState.selectPageSizeQuestion(state.askToEcosystem)))
    ),
    map(([action, pageSize]: [QuestionActions.SetSearch, number]) => new QuestionActions.LoadQuestions({
      pkTeam: action.payload.pkTeam,
      pkProject: action.payload.pkProject,
      pageIndex: 1,
      pageSize: pageSize
    }))
  );

  @Effect()
  markAsFavorite$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SET_FAVORITE),
      switchMap((action: QuestionActions.SetAsFavorite) =>
        this.askService.setFavoriteQuestion(action.payload, true).pipe(
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
        this.askService.setFavoriteQuestion(action.payload, false).pipe(
          catchError(error => this.notify('WRONG', new QuestionActions.UnsetAsFavoriteFail(error), true)),
          map((response: Post) => new QuestionActions.UnsetAsFavoriteSuccess(response))
        )
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private askService: AskToEcosystemService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('PROJECT.ASK_ECOSYSTEM.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
