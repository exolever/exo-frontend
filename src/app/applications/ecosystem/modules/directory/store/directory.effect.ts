import {Injectable} from '@angular/core';

import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Observable, defer, of as observableOf } from 'rxjs';
import {flatMap, map, switchMap} from 'rxjs/operators';

import {IFilter} from '@shared/components/filter/filter.component';
import {OrderEnum} from '@applications/shared/enums';
import {ConsultantModel, PaginationModel} from '@applications/shared/models';

import {FilterOptionsService} from '../service/filter.service';
import {DirectoryService} from '../service/directory.service';
import * as DirectoryActions from './directory.actions';


@Injectable()
export class DirectoryEffects {

  @Effect()
  filtering$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.FILTER),
    map((action: DirectoryActions.Filter) => action.payload),
    map((filter: any) => new DirectoryActions.Filter(filter)),
    map(() => new DirectoryActions.Search())
  );

  @Effect()
  restoring$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.FILTERS_RESTORE),
    switchMap(() => this.filterService.initializeFilters()),
    map((filters: IFilter[]) =>
      new DirectoryActions.FiltersSet({filters: filters})
    )
  );

  @Effect()
  cachedFiltering$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.FILTERS_SET),
    map(() => new DirectoryActions.Search())
  );

  @Effect()
  searching$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.SEARCH),
    switchMap(() => this.directoryService.getDirectory()),
    flatMap((response: PaginationModel<ConsultantModel>) => [
      new DirectoryActions.SearchSuccess(response),
      new DirectoryActions.LoadConsultants(response)
    ])
  );

  @Effect()
  paging$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.PAGINATE),
    map((action: DirectoryActions.Paginate) => action.payload),
    map((pageInfo) => new DirectoryActions.Paginate(pageInfo)),
    map(() => new DirectoryActions.Search())
  );

  @Effect()
  typing$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.SEARCH_TERMS),
    map((action: DirectoryActions.SetSearchTerms) => action.payload),
    map((terms: string) => new DirectoryActions.SetSearchTerms(terms)),
    map(() => new DirectoryActions.Search())
  );

  @Effect()
  sorting$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.SORT),
    map((action: DirectoryActions.Sort) => action.payload),
    map((sorting: string) => new DirectoryActions.Sort(sorting)),
    map(() => new DirectoryActions.Search())
  );

  @Effect()
  ordering$: Observable<Action> = this.actions$.pipe(
    ofType(DirectoryActions.ORDER),
    map((action: DirectoryActions.Order) => action.payload),
    map((order: OrderEnum) => new DirectoryActions.Order(order)),
    map(() => new DirectoryActions.Search())
  );
  @Effect({dispatch: true})
  init$: Observable<any> = defer(() => observableOf(null)).pipe(
    switchMap(() => this.filterService.initializeFilters()),
    map((filters: IFilter[]) => new DirectoryActions.FiltersSet({filters: filters})),
  );


  constructor(
    private actions$: Actions,
    private filterService: FilterOptionsService,
    private directoryService: DirectoryService
  ) {
  }
}
