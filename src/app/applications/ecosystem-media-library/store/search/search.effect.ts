import {Injectable} from '@angular/core';

import {Action} from '@ngrx/store';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Observable} from 'rxjs';
import {flatMap, map, mergeMap, switchMap} from 'rxjs/operators';

import {IFilter} from '@shared/components/filter/filter.component';
import {OrderEnum} from '@applications/shared/enums';
import {PaginationModel} from '@applications/shared/models';

import {ResourcesService} from '../../services/resources.service';
import {FilterOptionsService} from '../../services/filter.service';
import {Resource} from '../resource.model';
import * as SearchActions from './search.actions';
import * as CrudActions from '../crud/crud.actions';
import {MediaLibraryWebsocketService} from '../real-time.service';

@Injectable()
export class SearchEffects {
  @Effect()
  searching$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.SEARCH),
    switchMap(() => this.resourcesService.getResources().pipe(
      flatMap((response: PaginationModel<Resource>) => [
        new SearchActions.SearchSuccess(response),
        new CrudActions.LoadResources(response)
      ])
    )),
  );

  @Effect()
  typing$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.SEARCH_TERMS),
    map((action: SearchActions.SetSearchTerms) => action.payload),
    map((terms: string) => new SearchActions.SetSearchTerms(terms)),
    map(() => new SearchActions.Search())
  );

  @Effect()
  paging$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.PAGINATE),
    map((action: SearchActions.Paginate) => action.payload),
    map((pageInfo) => new SearchActions.Paginate(pageInfo)),
    map(() => new SearchActions.Search())
  );

  @Effect()
  filtering$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.FILTER),
    map((action: SearchActions.Filter) => action.payload),
    map((filter: any) => new SearchActions.Filter(filter)),
    map(() => new SearchActions.Search())
  );

  @Effect()
  restoring$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.FILTERS_RESTORE),
    switchMap(() => this.filterService.getFilters()),
    mergeMap((filters: IFilter[]) =>
      [new SearchActions.FiltersSet({filters: filters}), new SearchActions.Search()]
    )
  );

  @Effect()
  ordering$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.ORDER),
    map((action: SearchActions.Order) => action.payload),
    map((order: OrderEnum) => new SearchActions.Order(order)),
    map(() => new SearchActions.Search())
  );

  @Effect()
  sorting$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.SORT),
    map((action: SearchActions.Sort) => action.payload),
    map((sorting: string) => new SearchActions.Sort(sorting)),
    map(() => new SearchActions.Search())
  );

  @Effect()
  gettingFilter$: Observable<Action> = this.actions$.pipe(
    ofType(SearchActions.FILTERS_GET),
    switchMap(() => this.filterService.getFilters().pipe(
      map((filters: IFilter[]) => new SearchActions.FiltersSet({filters: filters})),
      map((action: SearchActions.FiltersSet) => {
          this.realTimeService.getUpdates().subscribe();
          return action;
        }
      )
    ))
  );

  constructor(
    private actions$: Actions,
    private resourcesService: ResourcesService,
    private filterService: FilterOptionsService,
    private realTimeService: MediaLibraryWebsocketService
  ) {
  }
}
