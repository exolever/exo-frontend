import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Observable, of as observableOf, EMPTY as empty } from 'rxjs';
import { catchError, map, switchMap} from 'rxjs/operators';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action} from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { LoadOpportunity } from '@ecosystem/modules/opportunities/store/actions/opportunities.action';
import {
OpportunitiesAdminService
} from '@ecosystem/modules/opportunities/modules/admin/service/opportunities-admin.service';

import * as opportunitiesAdminActions from '../actions/opportunities-admin.action';


@Injectable()
export class OpportunitiesAdminEffect {

  @Effect()
  loadingOpportunityDetailAdmin$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.LOAD_OPPORTUNITY_ADMIN),
    switchMap((param: LoadOpportunity) => this.opportunitiesAdminService.getOpportunityDetailAdmin(param.pk).pipe(
      map(response => new opportunitiesAdminActions.LoadOpportunityAdminSuccess(response)),
      catchError(error => observableOf(new opportunitiesAdminActions.LoadOpportunityAdminFail(error)))
    )),
  );

  @Effect()
  selectApplicant$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.OPPORTUNITY_SELECT_APPLICANT),
    switchMap((action: opportunitiesAdminActions.OpportunitySelectAplicant) =>
      this.opportunitiesAdminService.selectApplicant(
        action.payload.applicant, action.payload.sow, action.payload.message
      ).pipe(
          map((response) => {
            return new opportunitiesAdminActions.OpportunitySelectApplicantSuccess({
              opportunity: response,
              applicant: action.payload.applicant

            });
          }),
          catchError(error => {
            return observableOf(new opportunitiesAdminActions.OpportunitySelectApplicantFail(error));
          }
        )
      )
    ),
  );

  @Effect()
  editSow$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.EDIT_SOW),
    switchMap((action: opportunitiesAdminActions.OpportunitySelectAplicant) =>
      this.opportunitiesAdminService.editSow(
        action.payload.applicant, action.payload.sow, action.payload.message
      ).pipe(
          map((response) => {
            return new opportunitiesAdminActions.EditSowSuccess({
              opportunity: response,
              applicant: action.payload.applicant
            });
          }),
          catchError(error => {
            return observableOf(new opportunitiesAdminActions.EditSowFail(error));
          }
        )
      )
    ),
  );

  @Effect()
  opportunitySelectApplicantSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.OPPORTUNITY_SELECT_APPLICANT_SUCCESS),
    map((action: opportunitiesAdminActions.OpportunitySelectApplicantSuccess) => action.payload.applicant),
    switchMap(applicant => {
      const snackBarRef = this.snackBar.open(
        this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.SELECT_CONFIRM'),
        this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.SEE_PROFILE'),
        { panelClass: 'success' }
      );
      snackBarRef.onAction().subscribe(
        () => this.router.navigate([applicant.user.profileUrl])
      );
      return empty;
    })
  );

  @Effect()
  opportunitySelectApplicantFail$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.OPPORTUNITY_SELECT_APPLICANT_FAIL),
    map((action: opportunitiesAdminActions.OpportunitySelectApplicantFail) => action.payload),
    switchMap(() => {
      this.snackBar.open(
        this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.FAIL'),
        this.translate.instant('COMMON.TRY_AGAIN'),
        { panelClass: 'error'}
      );
      return empty;
    })
  );

  @Effect()
  rejectApplicant$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.OPPORTUNITY_REJECT_APPLICANT),
    switchMap((action: opportunitiesAdminActions.OpportunityRejectAplicant) =>
      this.opportunitiesAdminService.rejectApplicant(
        action.payload.applicant.pk, action.payload.message
      ).pipe(
          map((response) => {
            return new opportunitiesAdminActions.OpportunityRejectApplicantSuccess(response);
          }),
          catchError(error => {
            return observableOf(new opportunitiesAdminActions.OpportunityRejectApplicantFail(error));
          }
        )
      )
    ),
  );

  @Effect()
  opportunityRejectApplicantSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.OPPORTUNITY_REJECT_APPLICANT_SUCCESS),
    map((action: opportunitiesAdminActions.OpportunityRejectApplicantSuccess) => action.payload),
    switchMap(() => {
      this.snackBar.open(
        this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.REJECT_CONFIRM'),
        this.translate.instant('COMMON.CLOSE'),
        { panelClass: 'success' });
      return empty;
    })
  );

  @Effect()
  opportunityRejectApplicantFail$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.OPPORTUNITY_REJECT_APPLICANT_FAIL),
    map((action: opportunitiesAdminActions.OpportunityRejectApplicantFail) => action.payload),
    switchMap(() => {
      this.snackBar.open(
        this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANT_DIALOG.FAIL'),
        this.translate.instant('COMMON.TRY_AGAIN'),
        { panelClass: 'error' });
      return empty;
    })
  );

  @Effect()
  closeOpportunity$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.CLOSE_OPPORTUNITY),
    switchMap((action: opportunitiesAdminActions.CloseOpportunity) => {
        return this.opportunitiesAdminService.closeOpportunity(
          action.payload.pk,
          action.payload.message,
          {'published_by_you': 'True'}
        ).pipe(
          map((response) => {
            this.showSnackBarAndNavigate(
              this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANTS.CLOSE_CONFIRM_SUCCESS'),
              this.translate.instant('NOTIFICATION.CLOSE')
            );
            return new opportunitiesAdminActions.CloseOpportunitySuccess(response);
          }),
          catchError(error => {
            this.showSnackBarAndNavigate(
              this.translate.instant('ECOSYSTEM.OPPORTUNITIES.APPLICANTS.CLOSE_CONFIRM_ERROR'),
              this.translate.instant('NOTIFICATION.CLOSE'),
              true
            );
            return observableOf(new opportunitiesAdminActions.CloseOpportunityFail(error));
          })
        );
    }),
  );

  @Effect()
  reopenOpportunity$: Observable<Action> = this.actions$.pipe(
    ofType(opportunitiesAdminActions.REOPEN_OPPORTUNITY),
    switchMap((action: opportunitiesAdminActions.ReopenOpportunity) => {
      return this.opportunitiesAdminService.reopenOpportunity(
        action.payload.pk,
        action.payload.deadline,
        {'published_by_you': 'True'}
      ).pipe(
        map((response) => {
          this.showSnackBarAndNavigate(
            this.translate.instant('ECOSYSTEM.OPPORTUNITIES.REOPEN_CONFIRM_SUCCESS'),
            this.translate.instant('NOTIFICATION.CLOSE'));
          return new opportunitiesAdminActions.ReopenOpportunitySuccess(response);
        }),
        catchError(error => {
          this.showSnackBarAndNavigate(
            this.translate.instant('ECOSYSTEM.OPPORTUNITIES.REOPEN_CONFIRM_ERROR'),
            this.translate.instant('NOTIFICATION.CLOSE'),
            true);
          return observableOf(new opportunitiesAdminActions.ReopenOpportunityFail(error));
        })
      );
    })
  );

  private showSnackBarAndNavigate(message: string, action: string, error = false): void {
    const panelClass = error ? 'error' : 'success';
    this.snackBar.open(message, action, { panelClass: panelClass });
  }

  constructor(
    private opportunitiesAdminService: OpportunitiesAdminService,
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
  ) { }

}
