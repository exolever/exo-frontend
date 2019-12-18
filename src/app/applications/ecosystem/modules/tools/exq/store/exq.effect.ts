import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { EMPTY as empty, Observable, of as observableOf } from 'rxjs';
import { catchError, flatMap, map, switchMap } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';

import { Urls, UrlService } from '@app/core';
import { ExqService } from '../service/exq.service';
import * as fromActions from './exq.action';
import { Survey } from './exq.model';
import { PaginationModel } from '@applications/shared/models';


@Injectable()
export class ExqEffect {
  closeLabel: string;

  @Effect()
  loading$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOAD_SURVEYS),
    switchMap(() => this.exqService.getSurveys().pipe(
      map(response => new fromActions.LoadSurveysSuccess(response)),
      catchError(error => this.showError('LOADING_SURVEYS_FAIL', new fromActions.LoadSurveysFail(error)))
    )),
  );

  @Effect()
  creating$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.ADD_SURVEY),
    switchMap((action: fromActions.AddSurveySuccess) => this.exqService.addSurvey(action.payload).pipe(
      map((survey: Survey) => {
        this.snackBar.open(this.translate.instant('ECOSYSTEM.EXQ.TOAST.ADD_SURVEY_SUCCESS'), this.closeLabel);
        const url = this.urlService.getPath([Urls.ECOSYSTEM_EXQ]);
        this.router.navigate([url]);
        return new fromActions.AddSurveySuccess(survey);
      }),
      catchError(error => this.showError('ADD_SURVEY_FAIL', new fromActions.AddSurveyFail(error)))
    )),
  );

  @Effect()
  getting$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.LOAD_SURVEY),
    switchMap((action: fromActions.LoadSurvey) => this.exqService.getSurvey(action.payload).pipe(
      map((survey: Survey) => new fromActions.LoadSurveySuccess(survey)),
      catchError(error => this.showError('SELECT_SURVEY_FAIL', new fromActions.LoadSurveyFail(error)))
    )),
  );

  @Effect()
  updating$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.UPDATE_SURVEY),
    switchMap((action: fromActions.UpdateSurvey) =>
      this.exqService.updateSurvey(action.payload.pk, action.payload.data).pipe(
        map((survey: Survey) => {
          this.snackBar.open(this.translate.instant('ECOSYSTEM.EXQ.TOAST.UPDATE_SURVEY_SUCCESS'), this.closeLabel);
          const url = this.urlService.getPath([Urls.ECOSYSTEM_EXQ]);
          this.router.navigate([url]);
          return new fromActions.UpdateSurveySuccess(survey);
        }),
        catchError(error => this.showError('UPDATE_SURVEY_FAIL', new fromActions.UpdateSurveyFail(error)))
      )
    ),
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.DELETE_SURVEY),
    switchMap((action: fromActions.DeleteSurvey) => this.exqService.deleteSurvey(action.payload.pk).pipe(
      map((s: Survey) => {
        this.snackBar.open(this.translate.instant('ECOSYSTEM.EXQ.TOAST.DELETE_SURVEY_SUCCESS'), this.closeLabel);
        return new fromActions.DeleteSurveySuccess({pk: action.payload.pk});
      }),
      catchError(error => this.showError('DELETE_SURVEY_FAIL', new fromActions.DeleteSurveyFail(error)))
    )),
  );

  @Effect()
  gettingResults$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.GET_SURVEY_RESULTS),
    switchMap((action: fromActions.GetSurveyResults) => this.exqService.getSurveysResults(action.payload).pipe(
      map((results) => new fromActions.GetSurveyResultsSuccess(
        {pk: action.payload, results: results})),
      catchError(error => this.showError('GET_SURVEY_RESULT_FAIL', new fromActions.GetSurveyResultsFail(error)))
    )),
  );

  @Effect()
  searching$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SEARCH),
    switchMap(() => this.exqService.getSurveys()),
    flatMap((response: PaginationModel<Survey>) => [
      new fromActions.SearchSuccess(response),
      new fromActions.LoadSurveys(response)
    ])
  );

  @Effect()
  paging$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.PAGINATE),
    map((action: fromActions.Paginate) => action.payload),
    map((pageInfo) => new fromActions.Paginate(pageInfo)),
    map(() => new fromActions.Search())
  );

  @Effect()
  typing$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SEARCH_TERMS),
    map((action: fromActions.SetSearchTerms) => action.payload),
    map((terms: string) => new fromActions.SetSearchTerms(terms)),
    map(() => new fromActions.Search())
  );

  @Effect()
  typingResult$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.SEARCH_TERMS_RESULT),
    map((action: fromActions.SetSearchTermsResult) => action.payload),
    map((payload) => new fromActions.SetSearchTermsResult(payload)),
    map((res) => new fromActions.GetSurveyResults(res.payload.pkSurvey))
  );

  @Effect()
  pagingResult$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.PAGINATE_RESULT),
    map((action: fromActions.PaginateResult) => action.payload),
    map((pageInfo) => new fromActions.PaginateResult(pageInfo)),
    map((res) => new fromActions.GetSurveyResults(res.payload.pkSurvey))
  );

  @Effect()
  deletingResult$: Observable<Action> = this.actions$.pipe(
    ofType(fromActions.DELETE_RESULT),
    switchMap((action: fromActions.DeleteResult) =>
      this.exqService.deleteResult(action.payload.pkSurvey, action.payload.pkResult).pipe(
      map((s: Survey) => {
        this.snackBar.open(this.translate.instant('ECOSYSTEM.EXQ.TOAST.DELETE_RESULT_SUCCESS'), this.closeLabel);
        return new fromActions.DeleteResultSuccess
        ({pkSurvey: action.payload.pkSurvey, pkResult: action.payload.pkResult});
      }),
      catchError(error => this.showError('DELETE_SURVEY_FAIL', new fromActions.DeleteSurveyFail(error)))
    )),
  );

  constructor(
    private actions$: Actions,
    private exqService: ExqService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private urlService: UrlService,
    private router: Router,
  ) {
    this.closeLabel = this.translate.instant('NOTIFICATION.CLOSE');
  }

  private showError(messageKey, error?) {
    this.snackBar.open(
      this.translate.instant('ECOSYSTEM.EXQ.TOAST.' + messageKey), this.closeLabel, { panelClass: 'error' }
    );
    return error ? observableOf(new fromActions.LoadSurveysFail(error)) : empty;
  }
}
