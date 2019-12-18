import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Observable, of } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom, mergeMap, concatMap } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';
import { Action, Store, select  } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Post } from '@forum/interfaces/post.interface';
import { Pagination } from '@core/interfaces/pagination.interface';
import { AppState } from '@core/store/reducers';

import { CircleService } from '../../services/circle.service';
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
        this.store$.pipe(select(state => fromState.selectSearchBy(state.circles))),
        this.store$.pipe(select(state => fromState.selectPageIndexQuestion(state.circles))),
        this.store$.pipe(select(state => fromState.selectPageSizeQuestion(state.circles)))
      ),
      switchMap(([action, searchBy, index, size]: [QuestionActions.LoadQuestions, string, number, number]) =>
        this.circlesService.getPosts({
          pageIndex: index + 1,
          pageSize: size,
          circleSlug: action.payload.circleSlug,
          searchBy: searchBy
        }).pipe(
          catchError(error => this.notify('WRONG', new QuestionActions.LoadQuestionsFail(error), true)),
          map((response: Pagination<Post>) => new QuestionActions.LoadQuestionsSuccess(response))
        )
      )
  );

  @Effect()
  loadingDetails$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.LOAD_QUESTION_DETAIL),
      switchMap((action: QuestionActions.LoadQuestionDetails) =>
        this.circlesService.getPostDetails(action.payload.questionSlug).pipe(
          catchError(error => {
            if (error.status && error.status !== 410) {
              return this.notify('WRONG', new QuestionActions.LoadQuestionDetailsFail(error), true);
            }
          }),
          mergeMap((response: Post) => [
            new QuestionActions.LoadQuestionDetailsSuccess(response),
            new AnswerActions.LoadAnswers({
              pkQuestion: response.pk,
              pageSize: 15,
              pageIndex: 1
              })
          ])
        )
      )
  );

  @Effect()
  creating$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.CREATE_QUESTION),
      switchMap((action: QuestionActions.CreateQuestion) => this.circlesService.createPost(
        action.payload.circleSlug,
        action.payload.data
        ).pipe(
          map((response) =>
            this.notify('CREATE_QUESTION_OK', new QuestionActions.CreateQuestionSuccess(response), false)),
          catchError(error => this.notify('WRONG', new QuestionActions.CreateQuestionFail(error), true))
        )
      )
  );

  @Effect()
  editing$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.EDIT_QUESTION),
      switchMap((action: QuestionActions.EditQuestion) => this.circlesService.editPost(
          action.payload.postPk, action.payload.data
        ).pipe(
          map((response) => this.notify('EDIT_QUESTION_OK', new QuestionActions.EditQuestionSuccess(response), false)),
          catchError(error => this.notify('WRONG', new QuestionActions.EditQuestionFail(error), true))
        )
      )
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.DELETE_QUESTION),
      concatMap((action: QuestionActions.DeleteQuestion) => of(action).pipe(
        withLatestFrom(
          this.store$.pipe(select(state => fromState.selectSlugByPk(state.circles, action.payload)))
        )
      )),
      switchMap(([action, slug]: [QuestionActions.DeleteQuestion, string]) =>
        this.circlesService.deletePost(action.payload).pipe(
          map(() =>
            this.notify('DELETE_QUESTION_OK', new QuestionActions.DeleteQuestionSuccess(slug), false)),
          catchError(error => this.notify('WRONG', new QuestionActions.DeleteQuestionFail(error), true))
        )
      )
  );

  @Effect()
  selecting$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SELECT_QUESTION),
      map((action: QuestionActions.SelectQuestion) => new QuestionActions.LoadQuestionDetails({
          circleSlug: action.payload.circleSlug,
          questionSlug: action.payload.questionSlug
      }))
  );

  @Effect()
  searching$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SEARCH),
      map((action: QuestionActions.SetSearch) =>
        new QuestionActions.LoadQuestions({circleSlug: action.payload.circleSlug}))
  );

  @Effect()
  paginating$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SET_PAGINATION),
      map((action: QuestionActions.SetPagination) =>
        new QuestionActions.LoadQuestions({circleSlug: action.payload.circleSlug}))
  );

  @Effect()
  markAsFavorite$: Observable<Action> = this.actions$
    .pipe(
      ofType(QuestionActions.TypeActionEnum.SET_FAVORITE),
      switchMap((action: QuestionActions.SetAsFavorite) =>
        this.circlesService.setFavoriteQuestion(action.payload, true).pipe(
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
        this.circlesService.setFavoriteQuestion(action.payload, false).pipe(
          catchError(error => this.notify('WRONG', new QuestionActions.UnsetAsFavoriteFail(error), true)),
          map((response: Post) => new QuestionActions.UnsetAsFavoriteSuccess(response))
        )
    )
  );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private circlesService: CircleService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  private notify(messageKey: string, action, isError?: boolean) {
    this.snackBar.open(
      this.translate.instant('ECOSYSTEM.CIRCLES.' + messageKey),
      this.translate.instant('COMMON.CLOSE'),
      { panelClass: isError ? 'error' : 'success' }
    );
    return action;
  }
}
