import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Action } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { Pagination } from '@core/interfaces/pagination.interface';
import { Urls, UrlService } from '@core/services';

import { Circle } from '../../models/circle.model';
import { CircleService } from '../../services/circle.service';
import * as CircleActions from '../action/circles.action';


@Injectable()
export class CirclesEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.LOAD_CIRCLES),
    switchMap((action: CircleActions.LoadCircles) => this.circlesService.getCircles().pipe(
      catchError(error => this.notify('WRONG', new CircleActions.LoadCirclesFail(error), true)),
      map((response: Pagination<Circle>) => new CircleActions.LoadCirclesSuccess(response.results))
    ))
  );

  @Effect()
  creating$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.CREATE_CIRCLE),
    switchMap((action: CircleActions.CreateCircle) => this.circlesService.createCircle(action.payload).pipe(
      catchError(error => this.notify('WRONG', new CircleActions.CreateCircleFail(error), true)),
      map((response: Circle) => new CircleActions.CreateCircleSuccess(response))
    ))
  );

  @Effect({ dispatch: false })
  creatingSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.CREATE_CIRCLE_SUCCESS),
    tap((action: CircleActions.CreateCircleSuccess) => {
      const url = this.urlService.getPath([Urls.ECOSYSTEM_CIRCLE_DETAIL, action.payload.slug]);
      this.router.navigate([url]);
    })
  );

  @Effect()
  updating$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.UPDATE_CIRCLE),
    switchMap((action: CircleActions.UpdateCircle) =>
      this.circlesService.updateCircle(action.payload.slug, action.payload.data).pipe(
        catchError(error => this.notify('WRONG', new CircleActions.UpdateCircleFail(error), true)),
        map((response: Circle) => new CircleActions.UpdateCircleSuccess(response))
    ))
  );

  @Effect()
  loadingOne$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.LOAD_CIRCLE),
    switchMap((action: CircleActions.LoadCircle) => this.circlesService.loadCircleDetails(action.payload).pipe(
      catchError(error => this.notify('WRONG', new CircleActions.LoadCircleFail(error), true)),
      map((response: Circle) => new CircleActions.LoadCircleSuccess(response))
    ))
  );

  @Effect()
  leaveCircle$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.LEAVE_CIRCLE),
    switchMap((action: CircleActions.LeaveCircle) => this.circlesService.leave(action.payload.slug).pipe(
      catchError(error => this.notify('WRONG', new CircleActions.LeaveCircleFail(), true)),
      map((response: Circle) => this.notify(
        'SNACKBAR.LEAVE_SUCCESS', new CircleActions.LeaveCircleSuccess(response)
      ))
    ))
  );

  @Effect({ dispatch: false })
  leaveCircleSuccess$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.LEAVE_CIRCLE_SUCCESS),
    tap((action: CircleActions.LeaveCircleSuccess) => {
      if (this.router.url !== Urls.ECOSYSTEM_CIRCLES_SUMMARY &&
        this.router.url !== Urls.ECOSYSTEM_CIRCLES_FEED) {
        const url = this.urlService.getPath([Urls.ECOSYSTEM_CIRCLES_SUMMARY]);
        this.router.navigate([url]);
      }
    })
  );

  @Effect()
  joinCircle$: Observable<Action> = this.actions$.pipe(
    ofType(CircleActions.TypeActionEnum.JOIN_CIRCLE),
    switchMap((action: CircleActions.JoinCircle) => this.circlesService.join(action.payload.slug).pipe(
      catchError(error => this.notify('WRONG', new CircleActions.JoinCircleFail(), true)),
      map((response: Circle) => new CircleActions.JoinCircleSuccess(response))
    ))
  );

  constructor(
    private actions$: Actions,
    private circlesService: CircleService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private urlService: UrlService
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
