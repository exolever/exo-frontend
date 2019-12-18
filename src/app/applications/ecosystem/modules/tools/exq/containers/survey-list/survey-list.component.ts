import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as SurveyActions from '../../store/exq.action';
import * as fromSurveys from '../../store/exq.reducer';
import { Survey } from '../../store/exq.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})
export class SurveyListComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;
  surveys$: Observable<Survey[]>;
  emptyMoment$: Observable<boolean>;
  pageIndex$: Observable<number>;
  pageSize$: Observable<number>;
  totalSurveys$: Observable<number>;
  searchControl = new FormControl();
  searchedText$: Observable<string>;
  private subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
  ) {
  }

  ngOnInit() {
    this.initializeData();
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
        .subscribe(
          (value) => this.store.dispatch(new SurveyActions.SetSearchTerms(value))
        ));
  }

  paginatorChange($event) {
    const pageIndex = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.store.dispatch(new SurveyActions.Paginate({
      pageIndex: pageIndex + 1,
      pageSize: pageSize
    }));
  }

  private initializeData() {
    this.searchedText$ = this.store.pipe(select(state => fromSurveys.getTerms(state)));
    this.loading$ = this.store.pipe(select(fromSurveys.isLoading));
    this.emptyMoment$ = this.store.pipe(select(fromSurveys.loadedWithoutContent));
    this.surveys$ = this.store.pipe(select(state => fromSurveys.getResults(state)));
    this.totalSurveys$ = this.store.pipe(select(state => fromSurveys.getTotalResults(state)));
    this.pageIndex$ = this.store.pipe(select(state => fromSurveys.getPage(state)));
    this.pageSize$ = this.store.pipe(select(state => fromSurveys.getPageSize(state)));
    this.store.dispatch(new SurveyActions.Search());
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
