import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { FormControl } from '@angular/forms';

import { Observable, Subscription} from 'rxjs';
import { select, Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UserModel } from '@app/core';
import { AppState } from '@core/store/reducers';
import * as fromUser from '@core/store/user/user.reducer';
import { RoleCategoryModel } from '@core/modules/roles/models';

import * as opportunitiesActions from '../../store/actions/opportunities.action';
import * as fromOpportunities from '../../store/reducers';
import { OpportunityModel } from '../../models/opportunity.model';

@Component({
  templateUrl: './opportunities-all.component.html',
  styleUrls: ['./opportunities-all.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OpportunitiesAllComponent implements OnInit, OnDestroy {
  opportunitiesList$: Observable<Array<OpportunityModel>>;
  loading$: Observable<boolean>;
  user$: Observable<UserModel>;
  emptyMoment$: Observable<boolean>;
  roles$: Observable<RoleCategoryModel[]>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  totalOpportunities$: Observable<number>;
  searchBox = new FormControl('');
  text$: Observable<string>;
  subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>
  ) { }

  ngOnInit(): void {
    this.store.dispatch(new opportunitiesActions.LoadOpportunities());
    this.opportunitiesList$ =
      this.store.pipe(select(
        (state) => fromOpportunities.selectOpportunities(state.opportunities)));
    this.user$ = this.store.pipe(select((state) => fromUser.getUser(state)));
    this.loading$ = this.store.pipe(
      select((state) => fromOpportunities.selectIsLoading(state.opportunities)));
    this.emptyMoment$ = this.store.pipe(select((state) => fromOpportunities.selectEmptyMoment(state.opportunities)));
    this.pageIndex$ = this.store.pipe(select(state => fromOpportunities.selectPageIndex(state.opportunities)));
    this.pageSize$ = this.store.pipe(select(state => fromOpportunities.selectPageSize(state.opportunities)));
    this.totalOpportunities$ = this.store.pipe(select(state => fromOpportunities.selectCount(state.opportunities)));
    this.text$ = this.store.pipe(select(state => fromOpportunities.selectSearch(state.opportunities)));

    this.subscriptions.add(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((value: string) => this.store.dispatch(new opportunitiesActions.SetSearch(value)))
    );
  }

  paginatorChange(page: PageEvent): void {
    this.store.dispatch(new opportunitiesActions.SetPagination({
      pageIndex: page.pageIndex + 1,
      pageSize: page.pageSize
    }));
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
