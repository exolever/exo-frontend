import { Component, Input, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { select, Store } from '@ngrx/store';

import { itemListAnimation } from '@animations/item-list.animation';
import { MixinGridLayoutComponent } from '@shared/utils/gridLayout';
import { AppState } from '@core/store/reducers';
import { Resource } from '@ecosystem-media-library/store/resource.model';
import * as SearchActions from '@ecosystem-media-library/store/search/search.actions';
import * as fromMediaLibrary from '@ecosystem-media-library/store/reducers';

@Component({
  selector: 'app-media-grid',
  templateUrl: './media-grid.component.html',
  styleUrls: ['./media-grid.component.scss'],
  animations: [itemListAnimation]
})
export class MediaGridComponent extends MixinGridLayoutComponent implements OnInit {
  resources$: Observable<Resource[]>;
  totalResources$: Observable<number>;
  pageIndex: Observable<number>;
  isLoading: Observable<boolean>;
  numberOfFilters: Observable<number>;
  pageSize: Observable<number>;

  @Input()
  fromPlatformProject = false;

  private projectContextUUID: string;

  constructor(
    protected mediaService: MediaObserver,
    private store: Store<AppState>,
    private route: ActivatedRoute
  ) {
    super(mediaService);
  }

  ngOnInit() {
    super.ngOnInit();

    /** actions to perform to determine the project context in which the media library might be enclosed */
    if ( this.isInProjectContext() ) {
      this.store.dispatch(new SearchActions.ProjectsUUID({ projectsUUID: this.projectContextUUID }));
    } else {
      this.store.dispatch(new SearchActions.ProjectsUUID({ projectsUUID: undefined }));
    }

    this.store.dispatch(new SearchActions.Search());
    this.initializeDataForGrid();
    this.resources$ = this.store.pipe(select(state => fromMediaLibrary.selectResults(state)));
    this.totalResources$ = this.store.pipe(select(state => fromMediaLibrary.selectResultsCount(state)));
    this.pageSize = this.store.pipe(select(state => fromMediaLibrary.selectPageSize(state)));
    this.pageIndex = this.store.pipe(select(state => fromMediaLibrary.selectPage(state)));  // minus to function
    this.isLoading = this.store.pipe(select(state => fromMediaLibrary.selectIsLoading(state)));
  }

  initializeDataForGrid() {
    this.cardsPerRow = 3;
    this.listGridLayout = [
      { breakpoint: 'lt-sm', cardsNumber: 1 },
      { breakpoint: 'xs', cardsNumber: 1 },
      { breakpoint: 'sm', cardsNumber: 2 },
      { breakpoint: 'md', cardsNumber: 3 },
      { breakpoint: 'gt-md', cardsNumber: 3 }
    ];
  }

  trackByPk(index, item: Resource) {
    return item ? item.pk : undefined;
  }

  changePage($event): void {
    const pageIndex = $event.pageIndex + 1;
    const pageSize = $event.pageSize;
    this.store.dispatch(new SearchActions.Paginate({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString()
    }));
  }

  /**
   * determines weather the user is in the context of a project by checking the router snapshot
   * @returns {boolean}
   */
  isInProjectContext(): boolean {
    let isInProject = false;
    let currentIteration: any = this.route.snapshot;
    while ( currentIteration && !isInProject ) {
      if (currentIteration.data['project']) {
        isInProject = true;
        this.projectContextUUID = currentIteration.data['project'].uuid;
      } else {
        currentIteration = currentIteration.parent;
      }
    }
    return isInProject;
  }


}
