import { Injectable } from '@angular/core';

import { Action, Store, select } from '@ngrx/store';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable, of as observableOf } from 'rxjs';
import { switchMap, map, catchError, withLatestFrom } from 'rxjs/operators';

import { MyJobsService } from '../services/my-jobs.service';
import * as MyJobsActions from './my-jobs.action';
import * as fromJobs from './my-jobs.reducer';
import { Pagination } from '@core/interfaces/pagination.interface';
import { Job } from '../models/job.model';
import { AppState } from '@core/store/reducers';

@Injectable()
export class MyJobsEffect {
  @Effect()
  loading$: Observable<Action> = this.actions$
    .pipe(
      ofType(MyJobsActions.MyJobsActionEnum.LOAD_JOBS),
      withLatestFrom(
        this.store$.pipe(select(state => fromJobs.selectSearchByJobs(state))),
        this.store$.pipe(select(state => fromJobs.selectPageIndexjobs(state))),
        this.store$.pipe(select(state => fromJobs.selectPageSizejobs(state)))
      ),
      switchMap(([action, searchBy, index, size]: [MyJobsActions.LoadJobs, string, number, number]) =>
        this.jobsService.getMyJobsList({pageIndex: index, pageSize: size, searchBy: searchBy}).pipe(
          map((response: Pagination<Job>) => new MyJobsActions.LoadJobsSuccess(response)),
          catchError(error => observableOf(new MyJobsActions.LoadJobsFail(error)))
        ))
    );

    @Effect()
    searching$: Observable<Action> = this.actions$
      .pipe(
        ofType(MyJobsActions.MyJobsActionEnum.SEARCH),
        map((action: MyJobsActions.SetSearch) =>
          new MyJobsActions.LoadJobs())
    );

    @Effect()
    paginating$: Observable<Action> = this.actions$
      .pipe(
        ofType(MyJobsActions.MyJobsActionEnum.SET_PAGINATION),
        map((action: MyJobsActions.SetPagination) => new MyJobsActions.LoadJobs())
    );

  constructor(
    private actions$: Actions,
    private store$: Store<AppState>,
    private jobsService: MyJobsService
  ) { }
}
