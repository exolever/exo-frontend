import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material';
import { AppState } from '@core/store/reducers';
import { select, Store } from '@ngrx/store';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable, Subscription} from 'rxjs';

import * as fromOpportunities from '@ecosystem/modules/opportunities/store/reducers';
import { OpportunityModel } from '@opportunities/models/opportunity.model';

import * as opportunitiesActions from '../../store/actions/opportunities.action';

@Component({
  templateUrl: './opportunities-by-you.component.html',
  styleUrls: ['./opportunities-by-you.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunitiesByYouComponent implements OnInit, OnDestroy {

  opportunitiesByYou$: Observable<Array<OpportunityModel>>;
  loading$: Observable<boolean>;
  emptyMoment$: Observable<boolean>;
  pageSizePublishedByYou$: Observable<number>;
  pageIndexPublishedByYou$: Observable<number>;
  totalOpportunitiesPublishedByYou$: Observable<number>;
  subscriptions = new Subscription();
  searchPublishedByYouBox = new FormControl('');
  textPublishedByYou$: Observable<string>;

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.store.dispatch(new opportunitiesActions.LoadAdminOpportunities());
    this.opportunitiesByYou$ = this.store.pipe(
      select((state) => fromOpportunities.selectOpportunitiesAdmin(state.opportunities))
    );
    this.loading$ = this.store.pipe(
      select((state) => fromOpportunities.selectAdminIsLoading(state.opportunities)));
    this.emptyMoment$ = this.store.pipe(
      select((state) => fromOpportunities.selectAdminEmptyMoment(state.opportunities)));
    this.pageIndexPublishedByYou$ = this.store.pipe(
      select(state => fromOpportunities.selectAdminPageIndex(state.opportunities)));
    this.pageSizePublishedByYou$ = this.store.pipe(
      select(state => fromOpportunities.selectAdminPageSize(state.opportunities)));
    this.totalOpportunitiesPublishedByYou$ = this.store.pipe(
      select(state => fromOpportunities.selectAdminCount(state.opportunities)));
    this.textPublishedByYou$ = this.store.pipe(
      select(state => fromOpportunities.selectAdminSearch(state.opportunities)));
    this.subscriptions.add(
      this.searchPublishedByYouBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((value: string) => this.store.dispatch(new opportunitiesActions.SetSearchAdmin(value)))
    );
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new opportunitiesActions.SetPaginationAdmin({
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
