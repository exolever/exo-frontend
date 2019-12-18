import {Component, Inject, Input, OnDestroy, Optional} from '@angular/core';
import {BreakPoint, DEFAULT_BREAKPOINTS, MediaObserver, ɵMatchMedia} from '@angular/flex-layout';
import {ActivatedRoute} from '@angular/router';

import {select, Store} from '@ngrx/store';
import {Observable, Subscription} from 'rxjs';
import {filter, first, take, tap} from 'rxjs/operators';

import {UserService} from '@app/core';
import {AppState} from '@core/store/reducers';
import {DATA, OverlayService} from '@overlay/services/overlay.service';
import {IFilter} from '@shared/components/filter/filter.component';

import * as fromMediaLibrary from '../../store/reducers';
import * as SearchActions from '../../store/search/search.actions';
import {Hubs} from '@ecosystem-media-library/store/resource.model';

@Component({
  selector: 'app-media-filters',
  templateUrl: './media-filters.component.html',
  styleUrls: ['./media-filters.component.scss']
})
export class MediaFiltersComponent implements OnDestroy {
  subscription = new Subscription();
  filters: Observable<IFilter[]>;
  thereAreFiltersApplied: Observable<boolean>;
  cachedFiltersState: Array<IFilter>;
  isMobile: boolean;
  @Input() showFullScreenTitle = true;
  /** project context stuff */
  private projectContextUUID: string;
  private ecosystemHubCode = 'E';

  constructor(
    private mediaMatch: ɵMatchMedia,
    private mediaObserver: MediaObserver,
    private store: Store<AppState>,
    private overlayService: OverlayService,
    private route: ActivatedRoute,
    private userService: UserService,
    @Optional() @Inject(DATA) public data: any
  ) {
    /** actions to perform to determine the project context in which the media library might be enclosed */
    if (this.isInProjectContext()) {
      this.store.dispatch(new SearchActions.ProjectsUUID({projectsUUID: this.projectContextUUID}));
    } else {
      this.userService.user$.subscribe(user => {
        if (!user.isSuperuser) {
          const userHubs = this.translateHubs(user.hubs);
          /** if Ecosystem search term is not included, it must be included to show ecosystem resources */
          if (!userHubs.includes(this.ecosystemHubCode)) {
            userHubs.push(this.ecosystemHubCode);
          }
          this.store.dispatch(new SearchActions.SectionsFields({sections: userHubs}));
        }
      });
      this.subscription.add(this.store.pipe(
        first(),
        filter(st => st.mediaLibrary.search.filters.length === 1),
        tap(() => this.store.dispatch(new SearchActions.FiltersGet()))
      ).subscribe());
    }
    this.subscription.add(this.mediaObserver.media$.subscribe(() => {
      this.isMobile = this.mediaMatch.isActive(
        DEFAULT_BREAKPOINTS.find((bp: BreakPoint) => bp.alias === 'lt-md').mediaQuery
      );
    }));

    this.filters = store.pipe(select(state => fromMediaLibrary.selectFilters(state)));
    this.thereAreFiltersApplied = store.pipe(select(state => fromMediaLibrary.selectSelectedOptions(state)));
    /**
     * cachedFiltersState is used as cache of the original state. As cachedFiltersState is an array of
     * complex objects (not basic data types), to create a new copy of the array with a new copy of its elements
     * (in other case, the inner elements will be updated with the changes in the store) I need to create and parse
     * a auxiliary JSON.
     */
    this.store.pipe(
      select(state => fromMediaLibrary.selectFilters(state)),
      take(1)
    ).subscribe((obj: IFilter[]) => this.cachedFiltersState = JSON.parse(JSON.stringify(obj)));
  }

  onUpdateFilters($event): void {
    this.store.dispatch(new SearchActions.Filter($event));
  }

  onSubmit() {
    this.overlayClose();
  }

  clear(): void {
    this.store.dispatch(new SearchActions.FiltersSet({filters: this.cachedFiltersState, forceReset: true}));
    this.overlayClose();
  }

  onCleanFilters(): void {
    this.store.dispatch(new SearchActions.RestoreFilters());
  }

  enableSearch(f: IFilter): boolean {
    const hiddenOptions = f.options.filter(opt => opt.showByDefault === false);
    return hiddenOptions ? hiddenOptions.length > 0 : false;
  }

  overlayClose(): void {
    this.overlayService.close();
  }

  /**
   * receives the user hubs in the logged user and returns each one of them translated to the corresponding code or
   * undefined if it's not found
   * @param {Array<{name: string}>} userHubs
   * @returns {Array<string>}
   */
  translateHubs( userHubs: Array<{ name: string, code: string }>): Array<string> {
    const loggedUserHubsCorrespondingCode = Hubs;
    return userHubs.map( hub => {
      let mappedHub;
      if (loggedUserHubsCorrespondingCode.map(codeLabel => codeLabel.code).includes(hub.code)) {
        mappedHub = loggedUserHubsCorrespondingCode[
          loggedUserHubsCorrespondingCode.map(codeLabel => codeLabel.code).indexOf(hub.code)
          ].code;
      }
      return mappedHub;
    });
  }

  /**
   * determines weather the user is in the context of a project by checking the router snapshot
   * @returns {boolean}
   */
  isInProjectContext(): boolean {
    let isInProject = false;
    let currentIteration: any = this.route.snapshot;
    while (currentIteration && !isInProject) {
      if (currentIteration.data['project']) {
        isInProject = true;
        this.projectContextUUID = currentIteration.data['project'].uuid;
      } else {
        currentIteration = currentIteration.parent;
      }
    }
    return isInProject;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
