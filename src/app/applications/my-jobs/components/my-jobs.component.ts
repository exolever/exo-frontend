import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '@core/store/reducers';
import * as MyJobsAction from '../store/my-jobs.action';
import * as fromJobs from '../store/my-jobs.reducer';
import { Job } from '../models/job.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-my-jobs',
  templateUrl: './my-jobs.component.html',
  styleUrls: ['./my-jobs.component.scss']
})
export class MyJobsComponent implements OnInit {
  loading$: Observable<boolean>;
  emptyMoment$: Observable<boolean>;
  items$: Observable<Job[]>;
  totalJobs$: Observable<number>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;
  text$: Observable<string>;
  searchBox = new FormControl('');
  subscriptions = new Subscription();

  constructor(
    private store: Store<AppState>,
  ) { }

  ngOnInit() {
    this.store.dispatch(new MyJobsAction.LoadJobs());
    // store selectors
    this.emptyMoment$ = this.store.pipe(select(state => fromJobs.jobsEmptyMoment(state)));
    this.loading$ = this.store.pipe(select(state => fromJobs.jobsAreLoading(state)));
    this.items$ = this.store.pipe(select(state => fromJobs.selectAllJobs(state)));
    this.pageSize$ = this.store.pipe(select(state => fromJobs.selectPageSizejobs(state)));
    this.totalJobs$ = this.store.pipe(select(state => fromJobs.selectCountJobs(state)));
    this.pageIndex$ = this.store.pipe(select(state => fromJobs.selectPageIndexjobs(state)));
    this.text$ = this.store.pipe(select(state => fromJobs.selectSearchByJobs(state)));

    this.subscriptions.add(
      this.searchBox.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe((value: string) =>
        this.store.dispatch(new MyJobsAction.SetSearch({searchBy: value}))
      )
    );
  }

  paginatorChange($event) {
    this.store.dispatch(new MyJobsAction.SetPagination({
      pageIndex: $event.pageIndex + 1,
      pageSize: $event.pageSize
    }));
  }

}
