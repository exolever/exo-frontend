import { Component, Inject, Optional, Input } from '@angular/core';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { DATA, OverlayService } from '@overlay/services/overlay.service';
import { IFilter } from '@shared/components/filter/filter.component';
import { AppState } from '@core/store/reducers';
import * as fromDirectory from '@ecosystem/modules/directory/store/directory.reducer';
import * as DirectoryActions from '@ecosystem/modules/directory/store/directory.actions';

@Component({
  selector: 'app-directory-filters',
  templateUrl: './directory-filters.component.html',
  styleUrls: ['./directory-filters.component.scss']
})
export class DirectoryFiltersComponent {
  subscription = new Subscription();
  filters: Observable<IFilter[]>;
  thereAreFiltersApplied: Observable<boolean>;
  cachedFiltersState: Array<IFilter>;
  @Input() showFullScreen = true;

  constructor(
    private store: Store<AppState>,
    private overlayService: OverlayService,
    @Optional() @Inject(DATA) public data: any
  ) {
    this.filters = store.pipe(select(state => fromDirectory.getFilters(state)));
    this.thereAreFiltersApplied = store.pipe(select(state => fromDirectory.getSelectedOptions(state)));
    /**
     * cachedFiltersState is used as cache of the original state. As cachedFiltersState is an array of
     * complex objects (not basic data types), to create a new copy of the array with a new copy of its elements
     * (in other case, the inner elements will be updated with the changes in the store) I need to create and parse
     * a auxiliary JSON.
     */
    this.subscription.add(store.pipe(
      select(state => fromDirectory.getFilters(state)),
      take(1)
    )
    .subscribe( (obj: IFilter[]) => this.cachedFiltersState =  JSON.parse(JSON.stringify(obj)))
    );
  }

  onUpdateFilters($event): void {
    this.store.dispatch(new DirectoryActions.Filter($event));
  }

  onSubmit() {
    this.overlayClose();
  }

  clear(): void {
    this.store.dispatch(new DirectoryActions.FiltersSet({filters: this.cachedFiltersState, forceReset: true}));
    this.overlayClose();
  }

  onCleanFilters(): void {
    this.store.dispatch(new DirectoryActions.RestoreFilters());
  }

  enableSearch(filter: IFilter): boolean {
    const hiddenOptions = filter.options.filter(opt => opt.showByDefault === false );
    return  hiddenOptions && hiddenOptions.length > 0;
  }

  overlayClose(): void {
    this.overlayService.close();
  }
}
