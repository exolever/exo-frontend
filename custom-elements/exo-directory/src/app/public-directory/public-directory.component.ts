import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

import { ApiService } from '../api.service';
import { PeopleInterface, SearchTermInterface } from '../enumInterface';

@Component({
  selector: 'app-public-directory',
  templateUrl: './public-directory.component.html',
  styleUrls: ['./public-directory.component.scss']
})
export class PublicDirectoryComponent implements OnInit, OnDestroy {
  @Input() domain: string;
  searchControl = new FormControl(undefined);
  subscription = new Subscription();
  people: PeopleInterface[];
  isLoading = true;
  searchTerms: SearchTermInterface = {
    page: 1,
    page_size: 12
  };
  totalResults: number;
  translations = {
    searchPlaceholder: '',
    emptyMoment: ''
  };

  constructor(
    private apiService: ApiService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit() {
    this.setUpDomain();
    this.getPeople();
    this.initializeTranslations();
    this.subscription.add(
      this.searchControl.valueChanges.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(searchText => this.apiService.getPeople({ ...this.searchTerms, ...{search: searchText} })),
        tap(() => this.isLoading = true)
      ).subscribe(data => this.manageResults(data))
    );

  }

  initializeTranslations() {
    const isSpanish = window.location.href.includes('es.openexo.com');
    if (isSpanish) {
      this.translations = {
        searchPlaceholder: 'Buscar por nombre o localizacion',
        emptyMoment: `Parece que no hay nadie con esas características. ¿Quieres ser el primero?
          <a href="https://es.openexo.com/join-community" target="_blank">Únete a nuestra comunidad ahora.`
      };
    } else {
      this.translations = {
        searchPlaceholder: 'Search by name or location',
        emptyMoment: `We couldn't find anyone matching those details. Maybe you can be the first?
          <a href="https://www.openexo.com/join-community"  target="_blank">Join our community now</a>`
      };
    }
  }

  goToPublicProfile(slug: string) {
    window.open(`${this.domain}/public/profile/${slug}`, '_blank');
  }

  getPeople() {
    this.subscription.add(
      this.apiService.getPeople(this.searchTerms).subscribe(data => this.manageResults(data))
    );
  }

  manageResults(data) {
    this.isLoading = false;
    this.people = data.results;
    this.totalResults = data.count;
  }

  resetSearch() {
    this.searchControl.reset();
  }

  paginatorChange($event) {
    this.document.body.scrollTop = 0;
    this.searchTerms.page = $event.pageIndex + 1;
    this.searchTerms.page_size = $event.pageSize;
    this.getPeople();
  }

  setUpDomain() {
    this.domain = this.domain ? this.domain : window.location.origin;
    this.apiService.setDomain(this.domain);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
