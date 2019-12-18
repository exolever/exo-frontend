import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, OnDestroy, HostListener} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { Subscription } from 'rxjs';

import { Event } from '../exo-custom/event.model';
import { FiltersDialogComponent } from './filters/filters-dialog/filters-dialog.component';
import { IFilters } from './filter.interface';


@Component({
  selector: 'exo-custom-element',
  templateUrl: './exo-custom.component.html',
  styleUrls: ['./exo-custom.component.scss'],
})
export class ExoCustomElementComponent implements OnInit, OnDestroy {
  @Input() domain = 'http://localhost:8000';

  readonly urlEvents = 'events/api/event/search';
  readonly urlWebsites = 'api/landing/public-page/';
  events: Event[] = undefined;
  count: number;
  prev: string;
  next: string;
  pageSize = 9;
  page = 1;
  originalEvents: Event[] = undefined;
  subscriptions: Array<Subscription> = [];
  search = new FormControl('');
  selectedFilters: IFilters;
  counterSelectedFilters;
  countryOptions: string[] = [];
  languageOptions: string[] = [];

  @HostListener('keydown', ['$event'])
  public handleKeyboardEvent($event: KeyboardEvent) {
    if ($event.key === 'Enter') {
      this.onSearch();
    }
  }

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getListEvents(this.encodePagination());
  }

  getListEvents(queryParam = '') {
    this.subscriptions.push(
        this.http.get(`${this.domain}/${this.urlEvents}/${queryParam}`).subscribe((res: any) => {
        // this.http.get(`./assets/mock.json`).subscribe((res: any) => {
          this.count = res.count;
          this.prev = res.previous;
          this.next = res.next;
          this.originalEvents = res.results.map(element => new Event(element));
        if (this.countryOptions.length === 0 && this.languageOptions.length === 0) {
          const setCountries = new Set(this.originalEvents.filter(e => e.country !== '').map(e => e.country));
          const setLanguages = [].concat(...res.results.map(e => e.languages));
          this.languageOptions = Array.from(new Set(setLanguages));
          this.countryOptions = Array.from(setCountries);
        }
        this.events = this.originalEvents;
      })
    );
  }

  openFilters() {
    this.dialog.open(FiltersDialogComponent, {
      height: '100%',
      width: '100%',
      autoFocus: false,
      data: {
        events: this.events,
        selectedFilters: this.selectedFilters,
        languageOptions: this.languageOptions,
        countryOptions: this.countryOptions
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.selectedOptions(data);
      }
    });
  }

  onSearch() {
    this.updateEvents();
  }

  resetSearch() {
    this.search.reset();
    this.updateEvents();
  }

  selectedOptions(selected: IFilters) {
    this.selectedFilters = selected;
    this.updateEvents();
  }

  encodeQueryData(params: IFilters): string {
    let queryParams;
    if (params) {
      queryParams = Object.keys(params).filter(key => params[key].length > 0).map(key => {
        return params[key].map(value => {
          const filterQueryParams = typeof value === 'string' ? value : value.code;
          return `${this.decamelize(key)}=${filterQueryParams}`;
        }).join('&');
      }).join('&');
    }
    if (this.search.value) {
      queryParams = `search=${this.search.value}&${queryParams}`;
    }
    return queryParams;
 }

  filterFrontSide() {
    // HACK: Filter in the frontend side until model being refactorized.
    const followTypeOptions = [
      { code: 'P', name: 'On Site' },
      { code: 'S', name: 'On site + Streaming' },
      { code: 'V', name: 'Virtual' }
    ];
    this.events = this.originalEvents;
    Object.keys(this.selectedFilters).filter(key => this.selectedFilters[key].length > 0).map(key => {
      const filters = [];
      this.selectedFilters[key].map(value => {
        let filterByValue = typeof value === 'string' ? value : value.code;
        if (key === 'followType') {
          filterByValue = followTypeOptions.find(opt => opt.code === filterByValue).code;
        }
        filters.push(filterByValue);
      });
      this.events = this.events.filter(e => {
        if (typeof e[key] === 'string') {
          return filters.includes(e[key]);
        } else {
          return e[key].filter(item => filters.includes(item)).length > 0;
        }
      });
    });
  }

  updateEvents() {
    this.filterFrontSide();

    // const queryParams = this.encodeQueryData(this.selectedFilters);
    // this.getListEvents(queryParams);
    this.updateFilterCounter();
  }

  updateFilterCounter() {
    if (this.selectedFilters) {
      this.counterSelectedFilters = Object.keys(this.selectedFilters).filter(key => this.selectedFilters[key].length > 0).length;
    }
  }

  private decamelize(str, separator = '_') {
    return str
          .replace(/([a-z\d])([A-Z])/g, '$1' + separator + '$2')
          .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + separator + '$2')
          .toLowerCase();
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onPrev() {
    this.page--;
    this.getListEvents(this.encodePagination());
  }

  onNext() {
    this.page++;
    this.getListEvents(this.encodePagination());
  }

  private encodePagination() {
    return `?page=${this.page}&page_size=${this.pageSize}`;
  }
}
