import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { AppState } from '@core/store/reducers';

import * as fromMediaLibrary from '../../store/reducers';
import * as SearchActions from '../../store/search/search.actions';
import { IFilter } from '@shared/components/filter/filter.component';
import { OverlayService } from '@overlay/services/overlay.service';
import { MediaFiltersComponent } from '@ecosystem-media-library/components/media-filters/media-filters.component';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchBox = new FormControl();
  text: Observable<string>;
  numberOfFilters$: Observable<number>;
  totalResources$: Observable<number>;

  @Input()
  fromPlatformProject = false;

  constructor(
    private store: Store<AppState>,
    public translateService: TranslateService,
    private overlayService: OverlayService
  ) {
    this.text = this.store.pipe(select(state => fromMediaLibrary.selectTerms(state)));
  }

  ngOnInit() {
    this.searchBox.valueChanges.pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => this.store.dispatch(new SearchActions.SetSearchTerms(value)));

    this.numberOfFilters$ = this.store.pipe(
      select(state => fromMediaLibrary.selectFilters(state)),
      map((filters: IFilter[]) =>
        filters.map((filterItem: IFilter) => {
          const optionsSelected = filterItem.options.filter(opt => opt.selected && filterItem.name !== opt.pk);
          return optionsSelected ? optionsSelected.length : 0;
        }).reduce(( accumulator, currentValue ) => accumulator + currentValue, 0)
      )
    );
    this.totalResources$ = this.store.pipe(select(state => fromMediaLibrary.selectResultsCount(state)));
  }

  openFilters() {
    this.overlayService.open(
      <Component>MediaFiltersComponent,
      {
        data: {
          title: this.translateService.instant('MEDIA.FILTERS.APPLY_FILTERS')
        },
      }
    );
  }

}
