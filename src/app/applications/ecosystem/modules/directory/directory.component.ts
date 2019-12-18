import { Component, Inject, OnDestroy, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';

import * as fromUser from '@core/store/user/user.reducer';
import { UserModel } from '@core/models/user/user.model';
import { AppState } from '@core/store/reducers';
import { OverlayService } from '@overlay/services/overlay.service';
import { IFilter } from '@shared/components/filter/filter.component';

import { DirectoryFiltersComponent } from './directory-filters/directory-filters.component';
import * as DirectoryActions from './store/directory.actions';
import { DIRECTORY_CONFIG } from './directory.conf';

import * as fromDirectory from './store/directory.reducer';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DirectoryComponent implements OnInit, OnDestroy {
  // view config params
  mobileInviteButtonWidth = '270px';

  searchControl = new FormControl();
  subscriptions = new Subscription();
  loggedUser$: Observable<UserModel>;
  isLoading$: Observable<boolean>;
  sortBy$: Observable<string>;
  totalConsultants$: Observable<number>;
  numberOfFilters$: Observable<number>;
  searchedText$: Observable<string>;
  openedDialog = false;

  constructor(
    private translateService: TranslateService,
    private overlayService: OverlayService,
    private store: Store<AppState>,
    @Inject(DIRECTORY_CONFIG) private directoryConfig
  ) {}

  ngOnInit() {
    this.initializeData();
    this.subscriptions.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged()
      ).subscribe(value =>
        this.store.dispatch(new DirectoryActions.SetSearchTerms(value))
      )
    );
  }

  initializeData(): void {
    this.sortBy$ = this.store.pipe(select(state => fromDirectory.getSortBy(state)));
    this.isLoading$ = this.store.pipe(select(state => fromDirectory.getIsLoading(state)));
    this.totalConsultants$ = this.store.pipe(select(state => fromDirectory.getTotalResults(state)));
    this.searchedText$ = this.store.pipe(select(state => fromDirectory.getTerms(state)));
    this.loggedUser$ = this.store.pipe(select(state => fromUser.getUser(state)));
    this.numberOfFilters$ = this.store.pipe(
      select(state => fromDirectory.getFilters(state)),
      map((filters: IFilter[]) =>
        filters.map((filterItem: IFilter) => {
          const optionsSelected = filterItem.options.filter(opt => opt.selected);
          return optionsSelected ? optionsSelected.length : 0;
        }).reduce(( accumulator, currentValue ) => accumulator + currentValue, 0)
      )
    );
  }

  onUpdateSortBy($event: any): void {
    const selectedSort = $event.value;
    const newOrder = this.directoryConfig.defaultOrder[selectedSort];
    this.store.dispatch(new DirectoryActions.Sort(selectedSort));
    this.store.dispatch(new DirectoryActions.Order(newOrder));
  }

  onShowFiltersDialog(): void {
    // It needed manage when the dialog is opened in order to avoid draw both set of filters
    this.openedDialog = true;
    this.overlayService.open(
      <Component>DirectoryFiltersComponent,
      {
        data: {
          title: this.translateService.instant('MEDIA.FILTERS.APPLY_FILTERS'),
        },
      }
    );
    this.subscriptions.add(
      this.overlayService.afterClosed.subscribe(() => {
        this.openedDialog = false;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}
