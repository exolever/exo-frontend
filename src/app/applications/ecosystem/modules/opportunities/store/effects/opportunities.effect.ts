import { Injectable, Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { Urls, UrlService } from '@core/services';
import { OverlayService } from '@overlay/services/overlay.service';
import { Pagination } from '@core/interfaces/pagination.interface';
import { AppState } from '@core/store/reducers';

import * as opportunitiesActions from '../actions/opportunities.action';
import { LoadOpportunity } from '../actions/opportunities.action';
import { OpportunitiesListService } from '../../services/opportunities-list.service';
import { OpportunityDetailService } from '../../services/opportunity-detail.service';
import { OpportunityModel } from '../../models/opportunity.model';
import {
  OpportunityPreviewComponent
} from '../../components/opportunity-preview/opportunity-preview.component';

import * as fromState from '../reducers/index';

@Injectable()
export class OpportunitiesEffect {

  @Effect()
  loadingAll$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.LOAD_OPPORTUNITIES_ALL),
    withLatestFrom(
      this.store.pipe(select(state => fromState.selectSearch(state.opportunities))),
      this.store.pipe(select(state => fromState.selectPageIndex(state.opportunities))),
      this.store.pipe(select(state => fromState.selectPageSize(state.opportunities))),
    ),
    switchMap(([_, searchBy, index, size]: [opportunitiesActions.LoadOpportunities, string, number, number]) =>
      this.opportunitiesListService.getOpportunities({
        pageIndex: index + 1,
        pageSize: size,
        searchBy: searchBy,
    }).pipe(
        map((response: Pagination<OpportunityModel>) => new opportunitiesActions.LoadOpportunitiesSuccess(response)),
        catchError(error => observableOf(new opportunitiesActions.LoadOpportunitiesFail(error)))
    )),
  );

  @Effect()
  loadingByYou$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.LOAD_OPPORTUNITIES_BY_YOU),
    withLatestFrom(
      this.store.pipe(select(state => fromState.selectAdminSearch(state.opportunities))),
      this.store.pipe(select(state => fromState.selectAdminPageIndex(state.opportunities))),
      this.store.pipe(select(state => fromState.selectAdminPageSize(state.opportunities))),
    ),
    switchMap(([_, searchBy, index, size]: [opportunitiesActions.LoadOpportunities, string, number, number]) =>
      this.opportunitiesListService.getOpportunities({
        pageIndex: index + 1,
        pageSize: size,
        searchBy: searchBy,
        isPublishedByYou: true
    }).pipe(
      map(response => new opportunitiesActions.LoadAdminOpportunitiesSuccess(response)),
      catchError(error => observableOf(new opportunitiesActions.LoadAdminOpportunitiesFail(error)))
    )),
  );

  @Effect()
  loadingOpportunityDetail$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.LOAD_OPPORTUNITY),
    switchMap((param: LoadOpportunity) =>
      this.opportunityDetailService.getOpportunityDetail(param.pk).pipe(
        map(response => new opportunitiesActions.LoadOpportunitySuccess(response)),
        catchError(error => observableOf(new opportunitiesActions.LoadOpportunityFail(error)))
      )
    ),
  );

  @Effect({ dispatch: false })
    loadOpportunityFail$ = this.actions$.pipe(
    ofType(opportunitiesActions.LOAD_OPPORTUNITY_FAIL),
    tap((action: opportunitiesActions.LoadOpportunityFail) => {
      if (action.payload.status === 410 || action.payload.status === 404) {
        if (action.payload.status === 410) {
          this.matSnackBar.open(
            this.translate.instant('ECOSYSTEM.OPPORTUNITIES.FAIL_LOADING'),
            this.translate.instant('NOTIFICATION.CLOSE'),
            { panelClass: 'error' }
          );
        }
        const url = this.urlService.getPath([Urls.NOT_FOUND]);
        this.router.navigate([url], { skipLocationChange: true });
      }
    })
  );

  @Effect()
  paginating$: Observable<Action> = this.actions$
    .pipe(
      ofType(opportunitiesActions.SET_PAGINATION),
      map(() => new opportunitiesActions.LoadOpportunities())
  );

  @Effect()
  paginatingPublishedByYou$: Observable<Action> = this.actions$
    .pipe(
      ofType(opportunitiesActions.SET_PAGINATION_ADMIN),
      map(() => new opportunitiesActions.LoadAdminOpportunities())
  );

  @Effect()
  searching$: Observable<Action> = this.actions$
    .pipe(
      ofType(opportunitiesActions.SEARCH),
      map((action: opportunitiesActions.SetSearch) => new opportunitiesActions.LoadOpportunities())
  );

  @Effect()
  searchingPublishedByYou$: Observable<Action> = this.actions$
    .pipe(
      ofType(opportunitiesActions.SEARCH_ADMIN),
      map((action: opportunitiesActions.SetSearchAdmin) =>
        new opportunitiesActions.LoadAdminOpportunities())
  );


  @Effect()
  creating$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.CREATE_OPPORTUNITY),
    switchMap((
      action: opportunitiesActions.CreateOpportunity
    ) => this.opportunityDetailService.create(action.payload.data).pipe(
      map((response: OpportunityModel) => {
        this.matSnackBar.open(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CREATE.SUCCESS'),
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CREATE.SEE_OPPORTUNITY'),
          { panelClass: 'success' }
        ).onAction().subscribe(
          () => {
            const seeOpportunityUrl = this.urlService.getPath([
              action.payload.baseUrls.viewDetails, response.pk.toString()
            ]);
            this.router.navigate([seeOpportunityUrl]);
        });
        const url = this.urlService.getPath([action.payload.baseUrls.list]);
        this.router.navigate([url]);
        return new opportunitiesActions.CreateOpportunitySuccess(response);
      }),
      catchError(error => {
        this.matSnackBar.open(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CREATE.FAIL'),
          this.translate.instant('NOTIFICATION.CLOSE'),
          { panelClass: 'error' }
        );
        return observableOf(new opportunitiesActions.CreateOpportunityFail(error));
      })
    ))
  );

  @Effect()
  preview$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.PREVIEW_OPPORTUNITY),
    switchMap((
      action: opportunitiesActions.PreviewOpportunity
    ) => this.opportunityDetailService.preview(action.payload.data).pipe(
      map((response: OpportunityModel) => {
        this.overlayService.open(
          <Component>OpportunityPreviewComponent,
          {
            data: {
              title: this.translate.instant('ECOSYSTEM.OPPORTUNITIES.PREVIEW.TITLE'),
              opportunity: response,
              originalData: action.payload
            },
          }
        );
        return new opportunitiesActions.PreviewOpportunitySuccess(response);
      }),
      catchError(error => {
        this.matSnackBar.open(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.CREATE.FAIL'),
          this.translate.instant('NOTIFICATION.CLOSE'),
          { panelClass: 'error' }
        );
        return observableOf(new opportunitiesActions.PreviewOpportunityFail(error));
      })
    ))
  );

  @Effect()
  applying$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.APPLY_OPPORTUNITY),
    switchMap((action: opportunitiesActions.ApplyOpportunity) =>
      this.opportunityDetailService.applyOpportunity(action.payload.pkOpportunity, action.payload.dataToSend).pipe(
        map((response: OpportunityModel) => new opportunitiesActions.ApplyOpportunitySuccess(response)),
        catchError(error => observableOf(new opportunitiesActions.ApplyOpportunityFail(error)))
      )
    ),
  );

  @Effect()
  deleting$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.DELETE_OPPORTUNITY),
    map((action: opportunitiesActions.DeleteOpportunity) => action.payload),
    switchMap(payload => {
      return this.opportunityDetailService.delete(
        payload.pkOpportunity,
        payload.message,
        {'published_by_you': 'True'}
      ).pipe(
        map(() => {
          this.matSnackBar.open(
            this.translate.instant('ECOSYSTEM.OPPORTUNITIES.DELETE_DIALOG.SUCCESS'),
            this.translate.instant('COMMON.CLOSE'),
            { panelClass: 'success' }
          );
          if (payload.urlToNavigate) {
            this.router.navigate([payload.urlToNavigate]);
          }
          return new opportunitiesActions.DeleteOpportunitySuccess(payload.pkOpportunity);
        }),
        catchError(error => {
          this.matSnackBar.open(
            this.translate.instant('ECOSYSTEM.OPPORTUNITIES.DELETE_DIALOG.FAIL'),
            this.translate.instant('COMMON.CLOSE'),
            { panelClass: 'error' }
          );
          return observableOf(new opportunitiesActions.DeleteOpportunityFail());
        })
      );
    })
  );

  @Effect()
  editing$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.EDIT_OPPORTUNITY),
    switchMap((
      action: opportunitiesActions.EditOpportunity
    ) => this.opportunityDetailService.edit(
        action.payload.opportunityPk,
        action.payload.data,
        {'published_by_you': 'True'}
      ).pipe(
      map((response: OpportunityModel) => {
        const snackBarRef = this.matSnackBar.open(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.SUCCESS'),
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.SEE_DETAILS'),
          { panelClass: 'success' }
        );
        snackBarRef.onAction().subscribe(() => {
          const url = this.urlService.getPath(
            [action.payload.baseUrlViewDetails, action.payload.opportunityPk.toString()]
          );
          this.router.navigate([url]);
        });
        return new opportunitiesActions.EditOpportunitySuccess(response);
      }),
      catchError(error => {
        this.matSnackBar.open(
          this.translate.instant('ECOSYSTEM.OPPORTUNITIES.EDIT.FAIL'),
          this.translate.instant('NOTIFICATION.CLOSE'),
          { panelClass: 'error' }
        );
        return observableOf(new opportunitiesActions.EditOpportunityFail(error));
      })
    ))
  );

  @Effect()
  loadingAdvisoryCall$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesActions.LOAD_ADVISORY_CALL),
    withLatestFrom(
      this.store.pipe(select(state => fromState.selectAdminSearch(state.opportunities))),
      this.store.pipe(select(state => fromState.selectAdminPageIndex(state.opportunities))),
      this.store.pipe(select(state => fromState.selectAdminPageSize(state.opportunities))),
    ),
    switchMap((
      [action, searchBy, index, size]: [opportunitiesActions.LoadAdvisoryCall, string, number, number]) =>
      this.opportunitiesListService.getAdvisoryCalls({
        groupPk: action.payload,
        pageIndex: index + 1,
        pageSize: size,
        searchBy: searchBy,
        isPublishedByYou: true
    }).pipe(
      map(response => new opportunitiesActions.LoadAdvisoryCallSuccess(response)),
      catchError(error => observableOf(new opportunitiesActions.LoadAdvisoryCallFail(error)))
    )),
  );

  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private opportunitiesListService: OpportunitiesListService,
    private opportunityDetailService: OpportunityDetailService,
    private translate: TranslateService,
    private matSnackBar: MatSnackBar,
    private router: Router,
    private urlService: UrlService,
    private overlayService: OverlayService,
  ) { }

}
