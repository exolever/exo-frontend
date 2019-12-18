import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { AppState } from '@core/store/reducers';
import * as EventsActions from '../../store/events.action';
import * as fromEvents from '../../store/events.reducer';
import { Event } from '../../store/event.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss']
})
export class EventsListComponent implements OnInit {
  loading$: Observable<boolean>;
  emptyMoment$: Observable<boolean>;
  events$: Observable<Event[]>;
  totalEvents$: Observable<number>;
  pageSize$: Observable<number>;
  pageIndex$: Observable<number>;

  constructor(private store: Store<AppState>, ) {
  }

  ngOnInit() {
    this.loadEvents();
    this.events$ = this.store.pipe(select(fromEvents.getAll));
    this.loading$ = this.store.pipe(select(fromEvents.isLoading));
    this.emptyMoment$ = this.store.pipe(select(fromEvents.loadedWithoutContent));
    this.pageSize$ = this.store.pipe(select(state => fromEvents.selectPageSizeEvents(state)));
    this.totalEvents$ = this.store.pipe(select(state => fromEvents.selectCountEvents(state)));
    this.pageIndex$ = this.store.pipe(select(state => fromEvents.selectPageIndexEvents(state)));
  }

  paginatorChange($event: PageEvent) {
    const pageIndex = $event.pageIndex;
    const pageSize = $event.pageSize;
    this.loadEvents(pageIndex, pageSize);
  }

  private loadEvents(pageIndex = 0, pageSize = 15) {
    this.store.dispatch(new EventsActions.LoadEvents({
      pageIndex: pageIndex + 1,
      pageSize: pageSize
    }));
  }
}
