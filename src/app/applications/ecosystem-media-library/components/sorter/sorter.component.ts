import { Component, Inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';

import { Subscription, Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { OrderEnum } from '@applications/shared/enums/';
import { AppState } from '@core/store/reducers';

import { LIBRARY_CONFIG } from '../../ecosystem-media-library.conf';
import * as SearchActions from '../../store/search/search.actions';
import * as fromMediaLibrary from '../../store/reducers';

@Component({
  selector: 'app-sorter',
  templateUrl: './sorter.component.html',
  styleUrls: ['./sorter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SorterComponent implements OnInit, OnDestroy {
  order = OrderEnum.Asc ;
  sortBy = '';
  private subscriptions = new Subscription();
  selectValue$: Observable<string>;

  constructor(
    private store: Store<AppState>,
    public translator: TranslateService,
    @Inject(LIBRARY_CONFIG) private mediaConfig
  ) { }

  ngOnInit() {
    this.subscriptions.add(
      this.store.pipe(select(state => fromMediaLibrary.selectOrder(state))).subscribe(order => this.order = order)
    );
    this.subscriptions.add(
      this.store.pipe(select(state => fromMediaLibrary.selectSortBy(state))).subscribe(sortBy => this.sortBy = sortBy)
    );
    this.selectValue$ = this.store.pipe(select(state => fromMediaLibrary.selectOrderByAndSortValue(state)));
  }

  onChangeOrdering(): void {
    const newOrder = this.getRealOrder(this.order) === OrderEnum.Desc ? OrderEnum.Asc : OrderEnum.Desc;
    this.store.dispatch(new SearchActions.Order(newOrder));
  }

  onUpdateSortBy($event): void {
    const parsedEventData = $event.value.split('-');
    const newOrder = parsedEventData[1] === 'asc' ? OrderEnum.Asc : OrderEnum.Desc;

    this.store.dispatch(new SearchActions.Sort(parsedEventData[0]));
    this.store.dispatch(new SearchActions.Order(newOrder));
  }

  hasOrder(): boolean {
    return this.order !== undefined;
  }

  orderDescending(): boolean {
    return this.order === OrderEnum.Desc;
  }

  orderAscending(): boolean {
    return this.order === OrderEnum.Asc;
  }

  tooltipMessage(order: OrderEnum): string {
    return this.getRealOrder(order) === OrderEnum.Asc
      ? this.translator.instant('MEDIA.SORT_BY_TOOLTIP.DESC')
      : this.translator.instant('MEDIA.SORT_BY_TOOLTIP.ASC');
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private getRealOrder(order: OrderEnum): OrderEnum {
    return order === undefined ? this.mediaConfig.defaultOrder[this.sortBy] : order;
  }
}
